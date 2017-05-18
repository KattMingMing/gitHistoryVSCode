import * as parser from './logParser';
import { fetchForGitCmd } from '../api/fetch';

export async function getFileHistory(rootDir: string, relativeFilePath: string): Promise<any[]> {
    return await getLog(rootDir, ['--max-count=50', '--decorate=full', '--date=default', '--pretty=fuller', '--parents', '--numstat', '--topo-order', '--raw', '--follow', '--', relativeFilePath]);
}
export async function getFileHistoryBefore(rootDir: string, relativeFilePath: string, isoStrictDateTime: string): Promise<any[]> {
    return await getLog(rootDir, [`--max-count=10`, '--decorate=full', '--date=default', '--pretty=fuller', '--all', '--parents', '--numstat', '--topo-order', '--raw', '--follow', `--before='${isoStrictDateTime}'`, '--', relativeFilePath]);
}

export async function getLineHistory(rootDir: string, relativeFilePath: string, lineNumber: number): Promise<any[]> {
    let lineArgs = '-L' + lineNumber + ',' + lineNumber + ':' + relativeFilePath.replace(/\\/g, '/');
    return await getLog(rootDir, [lineArgs, '--max-count=50', '--decorate=full', '--date=default', '--pretty=fuller', '--numstat', '--topo-order', '--raw']);
}

async function getLog(rootDir: string, args: string[]): Promise<any[]> {
    console.log(`-- get log for: ${rootDir} -- with args ${args}`);
    return fetchForGitCmd(rootDir, args).then(resp => {
        let parsedLog = parser.parseLogContents(resp);
        return parsedLog;
    });
}

export async function writeFile(rootDir: string, commitSha1: string, sourceFilePath: string, targetFile: string): Promise<string> {
    console.log(`writing the file?`);
    return '';
    // return new Promise<string>((resolve, reject) => {
    //     const options = { cwd: rootDir };
    //     const objectId = `${commitSha1}:` + sourceFilePath.replace(/\\/g, '/');
    //     const args = ['show', objectId];

    //     logger.logInfo('git ' + args.join(' '));
    //     let ls = spawn(gitPath, args, options);

    //     let error = '';
    //     ls.stdout.on('data', function (data) {
    //         fs.appendFileSync(targetFile, data);
    //     });

    //     ls.stderr.on('data', function (data) {
    //         error += data;
    //     });

    //     ls.on('error', function(error) {
    //         logger.logError(error);
    //         reject(error);
    //         return;
    //     });

    //     ls.on('close', function() {
    //         if (error.length > 0) {
    //             if (error.includes('does not exist')) {
    //                 resolve('fileUnavailable');
    //                 return;
    //             }
    //             else {
    //                 logger.logError(error);
    //                 reject(error);
    //             }
    //             return;
    //         }
    //         resolve(targetFile);
    //     });
    // });
}