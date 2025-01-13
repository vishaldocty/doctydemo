/* agora.service.ts */
import { Injectable } from '@angular/core';
import AgoraRTC, {
  ILocalTrack,
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import { environment } from '../../environment';
import { BehaviorSubject } from 'rxjs';
import { addTrack } from '@agora-js/media';

@Injectable({
  providedIn: 'root',
})
export class AgoraService {
  private client: IAgoraRTCClient;
  private appId = environment.AgoraAppId;
  private localTracks: {
    audioTrack: IMicrophoneAudioTrack;
    videoTrack: ICameraVideoTrack;
  } | null = null;

  private channelJoinedSource = new BehaviorSubject<boolean>(false);
  channelJoined$ = this.channelJoinedSource.asObservable();

  constructor() {
    if (this.appId == '')
      console.error('APPID REQUIRED -- Open AgoraService.ts and update appId ');
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  }

  async joinChannel(
    channelName: string,
    token: string | null,
    uid: string | null
  ) {
    debugger;
  //  await this.client.setClientRole("host")
  const userId=  await this.client.join(this.appId, channelName, token, uid);

    const [audioTrack, videoTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks();
    await this.client.publish([audioTrack, videoTrack]);

    this.localTracks = {
      audioTrack: audioTrack,
      videoTrack: videoTrack,
    };

    this.channelJoinedSource.next(true);

    return userId
  }

  async leaveChannel() {
    await this.client.leave();
    this.channelJoinedSource.next(false);
  }

  setupLocalTracks(): Promise<ILocalTrack[]> {
    return AgoraRTC.createMicrophoneAndCameraTracks();
  }

  getClient() {
    return this.client;
  }
  getTracks() {
    return this.localTracks;
  }
}
