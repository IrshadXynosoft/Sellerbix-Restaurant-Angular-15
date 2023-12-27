import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';


import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import moment from 'moment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-food-cost-calculator',
  templateUrl: './food-cost-calculator.component.html',
  styleUrls: ['./food-cost-calculator.component.scss']
})
export class FoodCostCalculatorComponent implements OnInit {
  id: any;
  type: any;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  recordsArray: any = [];
  recipeTotal: any = 0.00;
  subRecipeTotal: any = 0.00;
  utilityTotal: any = 0.00;
  currency_symbol = localStorage.getItem('currency_symbol');
  date = moment().format('llll');
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: any, type: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<FoodCostCalculatorComponent>, private router: Router, private httpService: HttpServiceService, private route: ActivatedRoute, private snackBservice: SnackBarService) {
    this.id = this.data.id;
    this.type = this.data.type
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: [],
      colors: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
    };
  }
  ngOnInit(): void {
    this.getItem()
  }

  getItem() {
    this.httpService.get('recipe-modifier-get-by-id/' + this.id + '/' + this.type, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.recordsArray = result.data[0];
          if (this.type == 'recipe') {
            this.recordsArray.recipe_ingredient?.forEach((obj: any) => {
              this.recipeTotal = (parseFloat(this.recipeTotal) + parseFloat(obj.total_cost)).toFixed(2)
            });
            this.recordsArray.recipe_sub_recipe?.forEach((obj: any) => {
              this.subRecipeTotal = (parseFloat(this.subRecipeTotal) + parseFloat(obj.total_cost)).toFixed(2)
            });
            this.recordsArray?.recipe_utility?.forEach((obj: any) => {
              this.utilityTotal = (parseFloat(this.utilityTotal) + parseFloat(obj.cost)).toFixed(2)
            });
          }
          else if (this.type == 'modifier') {
            this.recordsArray.modifier_ingredient?.forEach((obj: any) => {
              this.recipeTotal = (parseFloat(this.recipeTotal) + parseFloat(obj.total_cost)).toFixed(2)
            });
            this.recordsArray.modifier_sub_recipe?.forEach((obj: any) => {
              this.subRecipeTotal = (parseFloat(this.subRecipeTotal) + parseFloat(obj.total_cost)).toFixed(2)
            });
            this.recordsArray?.modifier_utility?.forEach((obj: any) => {
              this.utilityTotal = (parseFloat(this.utilityTotal) + parseFloat(obj.cost)).toFixed(2)
            });
          }
          this.chartOptions.series = [parseFloat(this.recipeTotal), parseFloat(this.subRecipeTotal), parseFloat(this.utilityTotal)];
          this.chartOptions.labels = ["Primary", "Secondary", "Utility"];
          this.chartOptions.colors = ['rgb(97, 198, 97)', '#a0cd44', 'rgb(220, 171, 80)'], // Set colors for each series
            console.log(this.chartOptions.series);

        } else {
          this.snackBservice.openSnackBar(result.message, "Close")
        }
      });
  }

  close() {
    this.dialogRef.close()
  }
}
