import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {ExchangeDetailsComponent} from './exchange-details.component';
import {TabComponent} from './tab.component';
import {TabsComponent} from './tabs.component';
import {ExchangeAdapterModule} from '../exchange-adapter/exchange-adapter.module';
import {MarketsModule} from '../markets/markets.module';
import {EmailAlertsModule} from '../email-alerts/email-alerts.module';
import {SharedModule} from '../shared/shared.module';
import {TradingStrategiesModule} from '../trading-strategies/trading-strategies.module';

const routes: Routes = [
    {
        path: 'exchange/:id', component: ExchangeDetailsComponent
    }
];

/**
 * Container module for holding all the configuration screens.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule,
        ExchangeAdapterModule,
        EmailAlertsModule,
        MarketsModule,
        TradingStrategiesModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [ExchangeDetailsComponent, TabComponent, TabsComponent]
})
export class ExchangeDetailsModule {
}
