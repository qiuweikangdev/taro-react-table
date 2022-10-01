// generate version/tags

const { execSync } = require('child_process')
const pkg = require('../packages/table/package.json')
const { program } = require('commander')

program.option('-r, --release <version>', 'package version')
program.parse()

const { release } = program.opts()
try {
  if (release) {
    execSync(
      `cd packages/table && standard-version -r ${release} -t ${pkg.name}-v --infile ../../CHANGELOG.md`,
    )
    execSync(`git push origin ${pkg.name}-v${release}`)
    execSync(`git push origin HEAD`)
  } else {
    throw 'release does not exist'
  }
} catch (e) {
  console.log(e)
}
