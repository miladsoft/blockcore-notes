import { Component } from '@angular/core';
import { ApplicationState } from '../services/applicationstate.service';
import { EventService } from '../services/event.service';
import { FeedService } from '../services/feed.service';
import { ProfileService } from '../services/profile.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  wiped = false;
  wipedNonFollow = false;
  wipedNotes = false;

  constructor(private feedService: FeedService, private appState: ApplicationState, private storage: StorageService, private profileService: ProfileService) {}

  async clearProfileCache() {
    await this.profileService.wipeNonFollow();
    this.wipedNonFollow = true;
  }

  async clearDatabase() {
    await this.storage.wipe();
    this.wiped = true;
  }

  async clearNotesCache() {
    await this.feedService.wipe();
    this.wipedNotes = true;
  }

  ngOnInit() {
    this.appState.title = 'Settings';
    this.appState.showBackButton = true;
    this.appState.actions = [];
  }
}