import {OnInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ExchangeAdapter, ErrorCode, ErrorMessage, ExchangeAdapterHttpDataPromiseService} from '../model/exchange-adapter';

/**
 * Template-driven version of the Exchange Adapter form.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-exchange-adapter',
    templateUrl: 'exchange-adapter.component.html',
    styleUrls: ['exchange-adapter.component.css']
})
export class ExchangeAdapterComponent implements OnInit {

    exchangeAdapter: ExchangeAdapter;
    active = true;

    @ViewChild('exchangeAdapterForm') currentForm: NgForm;
    exchangeAdapterForm: NgForm;

    formErrors = {};

    validationMessages = {
        'adapterName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'className': {
            'required': 'Class Name is required.',
            'maxlength': 'Class Name max length is 120 characters.',
            'pattern': 'Class Name must be valid Java class, e.g. com.my.MyExchangeAdapterClass'
        },
        'connectionTimeout': {
            'required': 'Connection timeout is required.',
            'pattern': 'Connection timeout must be a whole number.'
        },
        'errorCode': {
            'required': 'Connection timeout is required.',
            'pattern': 'HTTP Status Code must be a 3 digit number.'
        },
        'errorMessage': {
            'required': 'Error message must not be empty.'
        }
    };

    constructor(private exchangeAdapterDataService: ExchangeAdapterHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeAdapterDataService.getExchangeAdapterByExchangeId(id)
                .then(exchangeAdapter => {
                    this.exchangeAdapter = exchangeAdapter;
                    this.updateFormErrors();
                });
        }).then(() => {/*done*/});
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    cancel() {
        this.goToDashboard();
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.exchangeAdapterDataService.update(this.exchangeAdapter)
                .then(() => this.goToDashboard());
        } else {
            this.onValueChanged(); // force validation for new untouched error codes/messages
        }
    }

    addErrorCode(): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push(new ErrorCode(null));
        this.updateFormErrors();
    }

    deleteErrorCode(code: ErrorCode): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes =
            this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.filter(c => c !== code);
        this.updateFormErrors();
    }

    addErrorMessage(message: string): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push(new ErrorMessage(message));
        this.updateFormErrors();
    }

    deleteErrorMessage(message: ErrorMessage): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages =
            this.exchangeAdapter.networkConfig.nonFatalErrorMessages.filter(m => m !== message);
        this.updateFormErrors();
    }

    updateFormErrors(): void {
            this.formErrors['adapterName'] = '';
        this.formErrors['className'] = '';
        this.formErrors['connectionTimeout'] = '';

        for (let i = 0; i < this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length; i++) {
            this.formErrors['errorCode_' + i] = '';
        }
        for (let i = 0; i < this.exchangeAdapter.networkConfig.nonFatalErrorMessages.length; i++) {
            this.formErrors['errorMessage_' + i] = '';
        }
    }

    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------

    ngAfterViewChecked() {
        this.formChanged();
    }

    formChanged() {

        if (this.currentForm === this.exchangeAdapterForm) {
            return;
        }

        this.exchangeAdapterForm = this.currentForm;
        if (this.exchangeAdapterForm) {
            this.exchangeAdapterForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {

        if (!this.exchangeAdapterForm) {
            return;
        }

        const form = this.exchangeAdapterForm.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.exchangeAdapterForm.submitted)) {

                    let messages;
                    if (field.indexOf('_') === -1) {
                        messages = this.validationMessages[field];
                    } else {
                        // for multiple error codes and messages
                        messages = this.validationMessages[field.substring(0, field.indexOf('_'))];
                    }

                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    }
}

