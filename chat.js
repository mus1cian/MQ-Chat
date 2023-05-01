const readline = require('readline');
const amqp = require('amqplib/callback_api');

const uri = "amqps://guestcc:guest1234567@b-696a8675-2568-46b1-a832-422ca01acbb4.mq.us-east-1.amazonaws.com:5671"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

amqp.connect(uri, (err, conn) => {
  if (err) {
    throw err;
  }

  conn.createChannel((err1, ch) => {
    if (err1) {
      throw err1;
    }

    const queueName = process.argv[2];

    ch.assertQueue(queueName, {
      durable: false
    });

    console.log(`Conectado a la cola ${queueName}`);

    rl.question('Ingrese su nombre: ', (name) => {
      console.log(`Bienvenido, ${name}!`);

      function sendMessage() {
        rl.question(`${name}: `, (message) => {
          ch.sendToQueue(queueName, Buffer.from(`${name}-${message}`));
          sendMessage();
        });
      }

      sendMessage();
    });
  });
});
