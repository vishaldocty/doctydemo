import { Component, ComponentRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LocalStreamComponent } from '../localstream/localstream.component';
import { RemoteStreamComponent } from '../remotestream/remotestream.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgoraService } from '../services/agora.service';
import { IAgoraRTCClient, IAgoraRTCRemoteUser, UID } from 'agora-rtc-sdk-ng';
import { RemoteUserComponent } from '../remote-user/remote-user.component';
@Component({
  selector: 'app-main-view',
  imports: [ReactiveFormsModule, LocalStreamComponent, RemoteStreamComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
})
export class MainViewComponent implements AfterViewInit {
  userForm: FormGroup;
  client: IAgoraRTCClient;
    userId!:UID 
  
  remoteUserComponentRefs: Map<string, ComponentRef<RemoteUserComponent>>;
  @ViewChild(RemoteStreamComponent)
  remoteComponent!: RemoteStreamComponent;
  isVideoCallStarting = false;
  constructor(private fb: FormBuilder, private agoraService: AgoraService) {
    this.userForm = this.createUserForm();
    this.client = this.agoraService.getClient();
    this.remoteUserComponentRefs = new Map();

  }

  ngAfterViewInit(): void {
    // add listeners when component mounts
    this.client.on('user-published', this.remoteComponent.handleRemoteUserPublished);
    this.client.on('user-unpublished', this.remoteComponent.handleRemoteUserUnpublished);

    this.client.on('stream-added', (event: any) => {
      console.log("stream added", event);
    });

    this.client.on('user-joined', (event: any) => {
      console.log("user joined", event);
    });
  }

  ngOnDestroy(): void {
    // remove listeners when component is removed
    this.client.off('user-published', this.remoteComponent.handleRemoteUserPublished);
    this.client.off('user-unpublished', this.remoteComponent.handleRemoteUserUnpublished);
  }

  //  private handleRemoteUserPublished = async (
  //    user: IAgoraRTCRemoteUser,
  //    mediaType: 'audio' | 'video' | 'datachannel'
  //  ) => {

  //    await this.client.subscribe(user, mediaType);
  //    if (mediaType === 'audio') {
  //      console.log('remote audio done');
  //      user.audioTrack?.play();
  //    } else if (mediaType === 'video') {
  //      const uid = user.uid;
  //      // create a remote user component for each new remote user and add to DOM
  //      const remoteUserComponentRef: ComponentRef<RemoteUserComponent> =
  //        this.remoteVideoContainer.createComponent(RemoteUserComponent);
  //      remoteUserComponentRef.instance.uid = uid;
  //      remoteUserComponentRef.instance.onReady = (remoteUserDiv) => {
  //        user.videoTrack?.play(remoteUserDiv);
  //      };
  //      this.remoteUserComponentRefs.set(uid.toString(), remoteUserComponentRef);
  //    }
  //  };

  //  private handleRemoteUserUnpublished = async (
  //    user: IAgoraRTCRemoteUser,
  //    mediaType: 'audio' | 'video' | 'datachannel'
  //  ) => {
  //    if (mediaType === 'video') {
  //      const remoteUserUid = user.uid.toString();
  //      // retrieve the div from remoteUserComponentRefs and remove it from DOM
  //      const componentRef = this.remoteUserComponentRefs.get(remoteUserUid);
  //      if (componentRef) {
  //        const viewIndex = this.remoteVideoContainer.indexOf(
  //          componentRef?.hostView
  //        );
  //        this.remoteVideoContainer.remove(viewIndex);
  //        // remove entry from remoteUserComponentRefs
  //        this.remoteUserComponentRefs.delete(remoteUserUid);
  //      } else {
  //        console.log(`Unable to find remoteUser with UID: ${user.uid}`);
  //      }
  //    }
  //  };

  createUserForm() {
    return this.fb.group({
      token: ['', [Validators.required]],
      channel: ['', [Validators.required]],
      uid: [''],
    });
  }

  async submitUserForm() {
    if (this.userForm.valid) {
      const { token, uid, channel } = this.userForm.value;
     this.userId = await this.agoraService.joinChannel(channel, token, uid);
      this.isVideoCallStarting = true;
    }
  }



}
