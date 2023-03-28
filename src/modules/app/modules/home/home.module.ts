import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { MapComponent } from 'src/modules/ui/components/map/map.component';
import { SidePanelComponent } from 'src/modules/ui/components/side-panel/side-panel.component';
import { ContourFilterComponent } from './components/contour-filter/contour-filter.component';
import { InputSelectComponent } from 'src/modules/ui/components/input-select/input-select.component';
import { SvgIconComponent } from 'src/modules/ui/components/svg-icon/svg-icon.component';
import { ContourAddComponent } from './components/contour-add/contour-add.component';
import { FieldsGroupComponent } from 'src/modules/ui/components/fields-group/fields-group.component';
import { SplineAreaChartComponent } from './components/spline-area-chart/spline-area-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ContourFormComponent } from './components/contour-form/contour-form.component';
import { InputComponent } from '../../../ui/components/input/input.component';
import { MapService } from './map.service';
import { CardAccordionComponent } from '../../../ui/components/card-accordion/card-accordion.component';
import { ContourEditComponent } from './components/contour-edit/contour-edit.component';
import { LoadingComponent } from '../../../ui/components/loading/loading.component';

@NgModule({
  declarations: [
    HomeComponent,
    ContourFilterComponent,
    ContourAddComponent,
    SplineAreaChartComponent,
    ContourFormComponent,
    ContourEditComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MapComponent,
    SidePanelComponent,
    InputSelectComponent,
    SvgIconComponent,
    FieldsGroupComponent,
    NgApexchartsModule,
    InputComponent,
    CardAccordionComponent,
    LoadingComponent,
  ],
  providers: [MapService]
})
export class HomeModule {
}
