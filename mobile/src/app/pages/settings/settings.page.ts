import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  settingsForm = this.formBuilder.group({
    apiBaseUrl: ['', Validators.required],
    apiTimeout: [0, [Validators.required, Validators.min(1)]],
    defaultDurationMinutes: [0, [Validators.required, Validators.min(1)]],
  });

  appName = '';
  appVersion = '';

  config = new FormGroup({
    "server": new FormGroup({
      "address": new FormControl("127.0.0.1", Validators.required),
    }),
    "others": new FormGroup({
      "example": new FormControl("asd", Validators.required),
      "example2": new FormControl("asd", Validators.required),
    }),
  });
  configIterable(): [string, [string, any][] ][] {
    // return config as a list of tuple to be iterate in the template
    return Object.entries(this.config.value).map(([key, value]) => {
      return [
        key,
        Object.entries(value),
      ];
     });
  }

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private navbarService: NavbarService,
  ) {
    effect(() => {
      const config = this.configService.config();
      if (config) {
        this.settingsForm.patchValue({
          apiBaseUrl: config.api.baseUrl,
          apiTimeout: config.api.timeout,
          defaultDurationMinutes: config.dateRequests.defaultDurationMinutes,
        });
        this.appName = config.app.name;
        this.appVersion = config.app.version;
      }
    });
  }

  ngOnInit() {
    this.navbarService.setTitle('settings');
    this.navbarService.setPrimary('settings');
    this.navbarService.setSecondary('settings');
  }

  onSubmit() {
    if (this.settingsForm.invalid) return;
    const { apiBaseUrl, apiTimeout, defaultDurationMinutes } = this.settingsForm.value;
    this.configService.updateApiConfig(apiBaseUrl!, apiTimeout!);
    this.configService.updateDateRequestsConfig(defaultDurationMinutes!);
  }
}
