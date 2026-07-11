const { generateInterviewReport } = require('./src/services/ai.services');

(async () => {
  try {
    const result = await generateInterviewReport({
      resume: 'Experienced software engineer with Node.js, Express, and MongoDB skills.',
      selfDescription: 'I build full stack applications with a focus on backend architecture.',
      jobDescription: 'Senior Backend Developer role requiring expertise in Node.js, AWS, and API design.'
    });
    console.log('SUCCESS', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('FAILED', err.toString());
    console.error('STACK', err.stack);
    if (err.response) {
      console.error('ERR RESPONSE', JSON.stringify(err.response, null, 2));
    }
  }
})();
