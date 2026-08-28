import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
    settingsForm = this.formBuilder.group({
    apiUrl: ['http://localhost:8000', Validators.required],
    apiTimeout: [0, [Validators.required, Validators.min(1)]],
    defaultDurationMinutes: [0, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private navbarService: NavbarService,
    private toastService: ToastService,
  ) {
    effect(() => {
      const config = this.configService.config();
      if (config) {
          this.settingsForm.patchValue({
          apiUrl: this.configService.getApiBaseUrl(),
          apiTimeout: config.api.timeout,
          defaultDurationMinutes: config.dateRequests.defaultDurationMinutes,
        });
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
    const { apiUrl, apiTimeout, defaultDurationMinutes } =
      this.settingsForm.value;
    this.configService.updateApiAddress(apiUrl!);
    this.configService.updateApiTimeout(apiTimeout!);
    this.configService.updateDateRequestsConfig(defaultDurationMinutes!);
    this.toastService.success('Settings saved', 'Configuration updated');
  }
}
