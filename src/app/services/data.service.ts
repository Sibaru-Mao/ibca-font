import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(
    private http: HttpService
  ) { }

  async getPlant() {
    return await this.http.get('base_PlantMappings/plantmapping')
  }

  async getYear() {
    return await this.http.get('v_task_Lists/demandyear')
  }

  async getDliveryMode() {
    return await this.http.get('v_task_Lists/transportmode')
  }

  async getTableData(data) {
    return await this.http.get(
      `v_task_Lists/search?Plant=${this.String(data.Plant)}&Project_Code=${data.Project_Code}&Battery_PN=${data.Battery_PN}` +
      `&Demand_Year=${data.Demand_Year}&Transport_Mode_Desc=${data.Transport_Mode_Desc}`)
  }

  async getNavigation(data) {
    return await this.http.get(
      `v_task_Lists/taskstatusqty?Plant=${this.String(data.Plant)}&Project_Code=${data.Project_Code}&Battery_PN=${data.Battery_PN}` +
      `&Demand_Year=${data.Demand_Year}&Transport_Mode_Desc=${data.Transport_Mode_Desc}`)
  }

  String(data) {
    return JSON.stringify(data)
  }

  async getTaskStatus() {
    return await this.http.get('mapping_TaskStatuses/taskstatusmapping')
  }

  async getInfo(task) {
    return await this.http.get(`v_task_Informations/otherinfo?Task_SN=${task}`)
  }

  async getTargetInfo(task) {
    return await this.http.get(`v_task_Lists/targetinfo?Task_SN=${task}`)
  }


}
