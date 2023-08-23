import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

async function getUsers() {
  const response = await fetch(
    'https://purple-pay.onrender.com/users/64e5c99d3a4bf6e5232eb9d5',
  );
  return response.json();
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return getUsers().then((user) => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`Hello, **${origin}**!`),
              text('Name:' + `  ${user.name}`),
              text('Date of birth:' + `  ${user.dob.split('T', 1)}`),
              text('Naitionality:' + `  ${user.nationality}`),
              text('VoterId:' + `  ${user.voterId}`),
            ]),
          },
        });
      });
    default:
      throw new Error('Method not found.');
  }
};
