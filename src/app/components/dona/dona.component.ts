import { Component, OnInit, Input } from '@angular/core';

import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  @Input() title: string = 'Sin titulo';

  // Doughnut
  // tslint:disable-next-line: no-input-rename
  @Input('labels') doughnutChartLabels: Label[] = ['Dato 1', 'Dato 2', 'Dato 3'];
  // tslint:disable-next-line: no-input-rename
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];

  // public doughnutChartType: ChartType = 'doughnut';

  public colors: Color[] = [
    { backgroundColor: [ '#00A6FB', '#a8dadc', '#2541b2'] }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
