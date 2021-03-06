import {ActivatedRouteStub} from '../../testing';
import {ExchangeAdapterComponent} from './exchange-adapter.component';
import {ExchangeAdapter, NetworkConfig, ErrorCode, ErrorMessage} from '../model/exchange-adapter';

/**
 * Tests the behaviour of the Exchange Adapter component (Template version) is as expected.
 *
 * Learning ground for writing Jasmine tests without using the TestBed.
 *
 * I think I prefer not using the TestBed - less code to write, less API to lean, more intuitive using pure Jasmine,
 * and you're decoupled from UI changes by accessing the model directly.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('ExchangeAdapterComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let exchangeAdapterComponent: ExchangeAdapterComponent;

    let expectedExchangeAdapter: ExchangeAdapter;
    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: ErrorCode[];
    let expectedErrorMsgs: ErrorMessage[];

    let expectedUpdatedExchangeAdapter: ExchangeAdapter;

    let spyExchangeAdapterDataService: any;
    let router: any;

    beforeEach(done => {

        expectedErrorCodes = [{'value': 501}];
        expectedErrorMsgs = [{'value': 'Connection timeout'}];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter',
            expectedNetworkConfig);

        expectedUpdatedExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.NewBtceExchangeAdapter',
            expectedNetworkConfig);

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchangeAdapter.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeAdapterDataService = jasmine.createSpyObj('ExchangeAdapterHttpDataPromiseService',
            ['getExchangeAdapterByExchangeId', 'update']);
        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.and.returnValue(Promise.resolve(expectedExchangeAdapter));
        spyExchangeAdapterDataService.update.and.returnValue(Promise.resolve(expectedUpdatedExchangeAdapter));

        exchangeAdapterComponent = new ExchangeAdapterComponent(spyExchangeAdapterDataService, <any> activatedRoute, router);
        exchangeAdapterComponent.ngOnInit();

        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.calls.first().returnValue.then(done);
    });

    it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', () => {
        expect(exchangeAdapterComponent.exchangeAdapter).toBe(expectedExchangeAdapter);

        // paranoia ;-)
        expect(exchangeAdapterComponent.exchangeAdapter.id).toBe('btce');
        expect(exchangeAdapterComponent.exchangeAdapter.name).toBe('BTC-e');
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0].value).toBe(501);
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        exchangeAdapterComponent.save(true);
        spyExchangeAdapterDataService.update.calls.first().returnValue
            .then((updatedAdapter) => {
                expect(updatedAdapter).toBe(expectedUpdatedExchangeAdapter);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        exchangeAdapterComponent.cancel();
        expect(spyExchangeAdapterDataService.update.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        exchangeAdapterComponent.save(false);
        expect(spyExchangeAdapterDataService.update.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should create new Error Code when user adds one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorCode();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1].value).toBeDefined();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1].value).toBeNull();
    });

    xit('should create new Error Message when user adds one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorMessage('We are ready at last to set sail for the stars.');
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1].value).toBe(
            'We are ready at last to set sail for the stars.');
    });

    it('should remove Error Code when user deletes one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeAdapterComponent.deleteErrorCode(expectedErrorCodes[0]);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    });

    xit('should remove Error Message when user deletes one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeAdapterComponent.deleteErrorMessage(expectedErrorMsgs[0]);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    });
});
