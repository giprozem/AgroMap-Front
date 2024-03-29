import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Map } from 'leaflet';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ISelectedControlLayer, ITileLayer } from '../../models/map.model';
import { InputRadioComponent } from '../input-radio/input-radio.component';
import { StoreService } from '../../services/store.service';
import { InputCheckboxComponent } from '../input-checkbox/input-checkbox.component';
import { InputRangeComponent } from '../input-range/input-range.component';
import { MapControlComponent } from '../map-control/map-control.component';

@Component({
  selector: 'app-map-control-layers-switch',
  standalone: true,
  templateUrl: './map-control-layers-switch.component.html',
  styleUrls: ['./map-control-layers-switch.component.scss'],
  imports: [
    CommonModule,
    SvgIconComponent,
    TranslateModule,
    InputRadioComponent,
    InputCheckboxComponent,
    InputRangeComponent,
    MapControlComponent,
  ],
})
export class MapControlLayersSwitchComponent
  implements OnChanges, AfterViewInit
{
  @ViewChild('dialog')
  dialog!: ElementRef<HTMLInputElement>;

  @Input() map!: Map;
  @Input() mode!: string;
  @Input() baseLayers: ITileLayer[] = [];
  @Input() wmsLayers: ITileLayer[] = [];
  @Input() activeBaseLayer: ITileLayer | null = null;
  @Input() wmsSelectedStatusLayers: Record<string, string> | null = null;
  @Input() storageName: string = 'MapControlLayersSwitchComponent';
  @Output() wmsLayerChanged = new EventEmitter<ITileLayer | null>();
  @Output() baseLayerChanged = new EventEmitter<ITileLayer | null>();
  wmsBaseLayers: ITileLayer[] = [];
  wmsOverLayers: ITileLayer[] = [];
  selected: Record<string, ISelectedControlLayer> = {};
  isCollapsed = false;
  initialBaseLayer!: ITileLayer;

  constructor(
    private elementRef: ElementRef,
    public translate: TranslateService,
    private store: StoreService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.adjustPosition();
  }

  ngOnChanges(changes: SimpleChanges) {
    const value = changes['mode'].currentValue;

    if (value) {
      this.selected['filterControlLayerSwitch'] = { name: value, opacity: 100 };

      this.handleWmsRadioButtonLayerChange(value);
    }

    if (!value) {
      const wmsSelectedStatusLayers: Record<string, any>[] | string[] =
        Object.entries({
          ...this.wmsSelectedStatusLayers,
        });

      const sortedWmsSelectedStatusLayers = [...wmsSelectedStatusLayers].sort(
        (a, b) => b?.[1]?.updatedAt - a?.[1]?.updatedAt
      );

      for (let i = sortedWmsSelectedStatusLayers.length - 1; i >= 0; i--) {
        const item = sortedWmsSelectedStatusLayers?.[i];
        this.handleWmsCheckboxLayerChange(!!item?.[1]?.name, item?.[0]);
      }

      if (this.wmsSelectedStatusLayers) {
        const filterControlLayerSwitchStatus: any =
          this.wmsSelectedStatusLayers['filterControlLayerSwitch'];

        if (filterControlLayerSwitchStatus instanceof Object) {
          this.selected['filterControlLayerSwitch'] = {
            name: filterControlLayerSwitchStatus.name,
            opacity: filterControlLayerSwitchStatus.opacity,
          };
          this.handleWmsRadioButtonLayerChange(
            filterControlLayerSwitchStatus.name
          );

          this.handleWmsInputRangeChange(
            filterControlLayerSwitchStatus.opacity,
            filterControlLayerSwitchStatus.name,
            'filterControlLayerSwitch'
          );
        }
      }
    }

    this.wmsBaseLayers = this.wmsLayers.filter((l) => l.type === 'radio');
    this.wmsOverLayers = this.wmsLayers.filter((l) => l.type === 'checkbox');
  }

  getActiveWmsLayerName(): string | null {
    const wmsSelectedStatusLayers: Record<string, any>[] = Object.values({
      ...(this.selected as Record<string, any>),
    });

    const activeWmsSelectedStatusLayers = [...wmsSelectedStatusLayers]
      .sort((a, b) => b?.['updatedAt'] - a?.['updatedAt'])
      .filter(
        (item) => item?.['name'] && item?.['updatedAt'] && item?.['layersName']
      )?.[0];

    return activeWmsSelectedStatusLayers?.['name'] ?? false;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickInside = this.elementRef.nativeElement.contains(target);
    if (!clickInside) {
      this.isCollapsed = false;
    }
  }

  handleWmsRadioButtonLayerChange(layerName: string | number): void {
    this.wmsLayers.map((l) => {
      if (l.type === 'radio') this.map.removeLayer(l.layer);
      const isCurrent = layerName === l.name;
      if (isCurrent) {
        this.map.addLayer(l?.layer);
        this.wmsLayerChanged.emit(l);
        this.handleWmsInputRangeChange(100, l.name, 'filterControlLayerSwitch');
      }
    });

    let obj = {} as ISelectedControlLayer;
    obj.name = String(layerName);
    if (layerName) {
      obj.oldValue = String(layerName);
    }

    const data = this.store.getItem(this.storageName);
    this.selected = {
      ...data,
      filterControlLayerSwitch: Object.assign(
        {},
        data?.['filterControlLayerSwitch'],
        obj
      ),
    };

    this.store.setItem(this.storageName, this.selected);
  }

  handleWmsCheckboxLayerChange(
    checked: boolean,
    layerName: string,
    event?: boolean
  ): void {
    this.wmsLayers.forEach((l) => {
      const isCurrent = layerName === l.name;
      if (isCurrent) {
        if (checked) {
          this.map.addLayer(l.layer);
        } else {
          this.map.removeLayer(l.layer);
        }

        this.selected[l.name] = { name: layerName, opacity: 100 };

        const data = this.store.getItem(this.storageName);
        const opacity = (this.wmsSelectedStatusLayers?.[layerName] as any)
          ?.opacity;

        if (data[layerName]?.opacity) {
          this.handleWmsInputRangeChange(data[layerName].opacity, l.name);
          this.selected[l.name]['opacity'] = data[layerName].opacity;
        } else {
          this.handleWmsInputRangeChange(opacity, l.name);
          this.selected[l.name]['opacity'] = opacity;
        }

        this.selected[l.name]['name'] = checked ? layerName : '';
        this.selected[l.name]['updatedAt'] = event
          ? Date.now()
          : data[layerName]?.updatedAt ?? null;
        this.selected[l.name]['layersName'] = (l.layer?.options as any)?.layers;

        this.store.setItem(
          this.storageName,
          Object.assign({}, data, this.selected)
        );
      }
    });
  }

  handleWmsInputRangeChange(value: any, layerName: string, key?: string) {
    const layer = this.wmsLayers.find((l) => l.name === layerName)?.layer;
    layer?.setOpacity(value / 100);

    let obj = {} as ISelectedControlLayer;
    obj.opacity = value;
    obj.name = this.selected[key ? key : layerName]?.name;
    obj.oldValue = this.selected[key ? key : layerName]?.oldValue;

    if (!(value instanceof Object)) this.selected[key ? key : layerName] = obj;

    this.store.setItem(this.storageName, this.selected);
  }

  handleBaseLayerChange(layerName: string | number): void {
    if (this.activeBaseLayer != null) {
      this.map.removeLayer(this.activeBaseLayer.layer);
      this.activeBaseLayer = null;
    }

    const current = this.baseLayers.find((l) => l.name === layerName);
    if (current != null) {
      this.activeBaseLayer = current;
      this.initialBaseLayer = current;
      this.map.addLayer(this.activeBaseLayer.layer);
    }

    this.cd.detectChanges();
    this.baseLayerChanged.emit(this.activeBaseLayer);
  }

  adjustPosition() {
    const element = this.dialog.nativeElement;
    const rect = element.getBoundingClientRect();

    if (rect.left < 0) {
      element.style.left = '0';
      element.style.bottom = '50px';
    } else if (rect.right > window.innerWidth) {
      element.style.left = window.innerWidth - rect.width + 'px';
      element.style.bottom = '50px';
    }
  }
}
