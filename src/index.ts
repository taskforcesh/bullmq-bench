import { BullMQSuite } from "./bullmq-suite";

const runSuites = async () => {
  console.log("Start running benchmark suites\n");

  const bullMQSuite = new BullMQSuite();

  await bullMQSuite.run();

  console.log("\nFinished running suites");
};

runSuites().catch(error => {
  console.error(error);
});
