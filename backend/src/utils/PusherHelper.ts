// pusher.helper.ts
import * as Pusher from 'pusher';

export class PusherHelper {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: "1690487",
      key: "00806514f90cf476dcd8",
      secret: "89275b37335b71cf95c8",
      cluster: 'ap1',
    });
  }

  public getPusherInstance(): Pusher {
    return this.pusher;
  }
}