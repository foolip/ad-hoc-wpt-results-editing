'use strict';

const assert = require('assert');
const fetch = require('node-fetch');
//const {Datastore} = require('@google-cloud/datastore');

async function deletePartialEdgeRuns() {
  //const datastore = new Datastore({ projectId: 'wptdashboard' });

  const url = 'https://wpt.fyi/api/runs?product=edge&label=azure&max-count=500';
  const runs = await (await fetch(url)).json();
  for (const run of runs) {
    assert(run.browser_version === '44.17763.1.0');
    const summary = await (await fetch(run.results_url)).json();
    const testNames = Object.keys(summary);
    if (testNames.length < 30000) {
      console.log(`Deleting https://wpt.fyi/results/?run_id=${run.id} with ${testNames.length} tests @${run.revision}`);
      /*
      const key = datastore.key(['TestRun', run.id]);
      const records = await datastore.get(key);
      assert(records.length === 1);
      const record = records[0];
      const labels = new Set(record.Labels);
      for (const expectedLabel of ['azure', 'safari', 'master', 'experimental', 'preview']) {
          assert(labels.has(expectedLabel), expectedLabel);
      }
      const result = await datastore.delete(record[datastore.KEY]);
      console.log(result);
      */
    } else {
      console.log(`Keeping https://wpt.fyi/results/?run_id=${run.id} with ${testNames.length} tests @${run.revision}`);
    }
  }
}

deletePartialEdgeRuns();
