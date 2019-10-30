'use strict';

const assert = require('assert');
const fetch = require('node-fetch');
//const {Datastore} = require('@google-cloud/datastore');

async function deletePartialSafariRuns() {
  //const datastore = new Datastore({ projectId: 'wptdashboard' });

  const url = 'https://wpt.fyi/api/runs?product=safari&labels=azure,master&max-count=500';
  const runs = await (await fetch(url)).json();
  for (const run of runs) {
    console.log(`Processing https://wpt.fyi/results/?run_id=${run.id} @${run.revision}`);
    const labels = new Set(run.labels);
    for (const expectedLabel of ['azure', 'safari', 'master', 'experimental', 'preview']) {
        assert(labels.has(expectedLabel), expectedLabel);
    }

    const summary = await (await fetch(run.results_url)).json();
    const testNames = Object.keys(summary);
    if (testNames.length < 30000) {
      console.log(`Deleting https://wpt.fyi/results/?run_id=${run.id} @${run.revision} with ${testNames.length} tests`);
      /*
      const key = datastore.key(['TestRun', run.id]);
      const records = await datastore.get(key);
      assert(records.length === 1);
      const record = records[0];
      const result = await datastore.delete(record[datastore.KEY]);
      console.log(result);
      */
    } else {
      console.log(`Keeping https://wpt.fyi/results/?run_id=${run.id} @${run.revision} with ${testNames.length} tests`);
    }
  }
}

deletePartialSafariRuns();
