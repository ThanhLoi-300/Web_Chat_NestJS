// pusher.helper.ts
import * as Pusher from 'pusher';

export class PusherHelper {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: '1781089',
      key: 'e9de4cb87ed812e6153c',
      secret: 'b32a80caba025cc38499',
      cluster: 'ap1',
    });
  }

  public getPusherInstance(): Pusher {
    return this.pusher;
  }
}