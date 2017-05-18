import * as vscode from 'vscode';

export async function getGitPath(): Promise<string> {
    return 'git';
}

export async function getGitRepositoryPath(fileName: string): Promise<string> {
    return vscode.workspace.rootPath!;
}
