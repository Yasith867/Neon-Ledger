import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Solidity source code
const contractPath = path.resolve(__dirname, '../contracts', 'EventLogger.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Compiler input
const input = {
  language: 'Solidity',
  sources: {
    'EventLogger.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

console.log('Compiling contract...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
  if (output.errors.some(e => e.severity === 'error')) {
    process.exit(1);
  }
}

const contract = output.contracts['EventLogger.sol']['EventLogger'];
const artifact = {
  abi: contract.abi,
  bytecode: contract.evm.bytecode.object,
};

// Ensure client directory exists
const clientDir = path.resolve(__dirname, '../client/src/contracts');
if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir, { recursive: true });
}

// Write artifacts
fs.writeFileSync(
  path.join(clientDir, 'EventLogger.json'),
  JSON.stringify(artifact, null, 2)
);

console.log('Contract compiled successfully! Artifacts saved to client/src/contracts/EventLogger.json');
