import mqtt from "mqtt";
import SensorReading from "../modules/sensors/sensorReading.model.js";
import Room from "../modules/rooms/room.model.js";
import { evaluateRoomAlerts } from "../modules/alerts/alert.service.js";
import { log, logError } from "../utils/logger.js";

const MQTT_BROKER = "mqtt://broker.hivemq.com";
const ROOM_ID = process.env.MQTT_ROOM_ID;

if (!ROOM_ID) {
    throw new Error("❌ MQTT_ROOM_ID missing in .env");
}

let buffer = {
    temperature: null,
    light: null,
    motion: false,
    occupancy: 0,
};

let lastSavedAt = 0;
const SAVE_INTERVAL = 5000; // 5 seconds

export const initMQTT = (io) => {
    const client = mqtt.connect(MQTT_BROKER, {
        clientId: `backend_${Math.random().toString(16).slice(2)}`,
        reconnectPeriod: 3000,
    });

    client.on("connect", () => {
        log("✅ MQTT connected");

        client.subscribe([
            "room/temperature",
            "room/light",
            "room/motion",
            "room/occupancy",
            "room/relay",
        ]);
    });

    client.on("message", async (topic, payload) => {
        const value = payload.toString();
        log(`📩 MQTT ${topic}: ${value}`);

        try {
            switch (topic) {
                case "room/temperature":
                    buffer.temperature = parseFloat(value);
                    break;

                case "room/light":
                    buffer.light = parseInt(value) > 200;
                    break;

                case "room/motion":
                    buffer.motion = value === "1";
                    break;

                case "room/occupancy":
                    buffer.occupancy = parseInt(value);
                    break;

                case "room/relay":
                    await Room.findByIdAndUpdate(ROOM_ID, {
                        "devices.light": value === "ON",
                    });
                    return;
            }

            const now = Date.now();
            if (now - lastSavedAt < SAVE_INTERVAL) return;

            lastSavedAt = now;

            const reading = await SensorReading.create({
                roomId: ROOM_ID,
                temperature: buffer.temperature,
                light: buffer.light,
                motion: buffer.motion,
                occupancy: buffer.occupancy,
            });

            // 🔥 UPDATE ROOM LIVE SNAPSHOT
            const room = await Room.findByIdAndUpdate(
                ROOM_ID,
                {
                    currentTemperature: buffer.temperature,
                    currentLight: buffer.light,
                    currentOccupancy: buffer.occupancy,
                    motionDetected: buffer.motion,
                    isOccupied: buffer.occupancy > 0,
                    lastSensorUpdate: new Date(),
                },
                { new: true }
            );

            // 🔒 SAFETY GUARD
            if (!room) {
                logError(`❌ Room not found for MQTT_ROOM_ID=${ROOM_ID}`);
                return;
            }

            // 🔥 Evaluate alert rules
            await evaluateRoomAlerts(room);

            io.emit("sensor:update", {
                roomId: ROOM_ID,
                temperature: reading.temperature,
                light: reading.light,
                motion: reading.motion,
                occupancy: reading.occupancy,
                createdAt: reading.createdAt,
            });

        } catch (err) {
            logError("MQTT processing error:", err);
        }
    });

    client.on("error", (err) => {
        logError("MQTT error:", err.message);
    });
};
