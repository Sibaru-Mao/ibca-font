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

  async getManInfo() {
    return await this.http.get('v_role_Permissions/permission')
  }

  async delete(data) {
    let ChineseProduct = await this.http.get(`manual_ProductNames/deleteproductname?id=${data.id}`)
    let special = await this.http.get(`/manual_SpecialSKUs/deletespecialsku?id=${data.id}`)
    let deleteInfo = await this.http.get(`v_task_Lists/deletetargetinfo?Task_SN=${data.Task_SN}&Transport_Mode=${data.Transport_Mode}&Delete_Reason=${data.Delete_Reason}`)
    return { ChineseProduct, special, deleteInfo }
  }

  async getSpecialData(data) {
    return await this.http.get(`manual_SpecialSKUs/getskubycondition?Plant=${data.PlantCode}
    &Project_Code=${data.Project_Code}&Material_No=${data.Material_No}`)
  }

  async getChineseProduct(data) {
    return await this.http.get(`manual_ProductNames/getproductbycondition?Plant=${data.PlantCode}
    &ProductName_ZH=${data.Project_Code}&ProductName_EN=${data.Material_No}`)
  }

  async getProductLine(data) {
    return await this.http.get(`manual_SpecialSKUs/getmodelbysku?Plant=${data.Plant}&Material_No=${data.Material_No}`)
  }

  async addSpecialArchitecture(data) {
    return this.http.post('manual_SpecialSKUs/maintainspecialsku', data)
  }

  async addChineseName(data) {
    return await this.http.post('manual_ProductNames/maintainproductname', data)
  }

  async deleteChineseName(id) {
    return await this.http.get(`manual_ProductNames/deleteproductname?id=${id}`)
  }

  async deleteSpecialArchitecture(id) {
    return await this.http.get(`manual_SpecialSKUs/deletespecialsku?id=${id}`)
  }

}
