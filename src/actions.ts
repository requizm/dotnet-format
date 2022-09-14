import {
  getBooleanInput,
  getInput,
  setOutput,
} from "@actions/core";

import {
  format, build as build1, 
} from "./dotnet";
import { checkVersion } from "./version";

export async function check(): Promise<void> {
  const onlyChangedFiles = getBooleanInput("only-changed-files");
  const failFast = getBooleanInput("fail-fast");
  const directory = getInput("directory") || ".";
  const version = getInput("version", { required: true });
  const solution = getInput("solution");

  const dotnetFormatVersion = checkVersion(version);

  const result = await format(dotnetFormatVersion)({
    dryRun: true,
    onlyChangedFiles,
    directory,
    solution,
  });

  setOutput("has-changes", result.toString());

  // fail fast will cause the workflow to stop on this job
  if (result && failFast) {
    throw Error("Formatting issues found");
  }
}

export async function fix(): Promise<void> {
  const onlyChangedFiles = getBooleanInput("only-changed-files");
  const directory = getInput("directory") || ".";
  const version = getInput("version", { required: true });
  const solution = getInput("solution");

  const dotnetFormatVersion = checkVersion(version);

  const result = await format(dotnetFormatVersion)({
    dryRun: false,
    onlyChangedFiles,
    directory,
    solution,
  });

  setOutput("has-changes", result.toString());
}

export async function build(): Promise<void> {
  const failFast = getBooleanInput("fail-fast");
  const directory = getInput("directory") || ".";
  const solution = getInput("solution");

  const result = await build1({
    dryRun: false,
    directory,
    solution,
  });

  if (result && failFast) {
    throw Error("Compile issues found");
  }
}
