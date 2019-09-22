import { BullMQSuite } from "./bullmq-suite";

const runSuites = async () => {
  console.log('Start runing benchmark suites\n');

  const bullMQSuite = new BullMQSuite();

  await bullMQSuite.run();

  console.log('\nFinished running suites');
};

runSuites();
