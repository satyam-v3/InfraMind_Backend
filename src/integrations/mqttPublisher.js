import mqtt from "mqtt";

const client = mqtt.connect("mqtt://broker.hivemq.com");

export const publishRelayCommand = (command) => {
  client.publish("room/commands", command);
};
