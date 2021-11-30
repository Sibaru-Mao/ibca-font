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

  // 获取任务信息外的其他信息
  async getInfo(task) {
    return await this.http.get(`v_task_Informations/otherinfo?Task_SN=${task}`)
  }

  // 获取任务信息
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

  // 查询特殊架构的信息
  async getSpecialData(data) {
    return await this.http.get(`manual_SpecialSKUs/getskubycondition?Plant=${data.PlantCode}
    &Project_Code=${data.Project_Code}&Material_No=${data.Material_No}`)
  }

  // 查询中文品名的信息
  async getChineseProduct(data) {
    return await this.http.get(`manual_ProductNames/getproductbycondition?Plant=${data.PlantCode}
    &ProductName_ZH=${data.Project_Code}&ProductName_EN=${data.Material_No}`)
  }

  // 查询产品包装信息PlantCode
  async productPacking(data) {
    return await this.http.get(`manual_Package/searchFilter?Plant=${data.PlantCode}&Project_Code=${data.Project_Code}&Material_No=${data.Material_No}`)
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

  async getBaseData(plant) {
    return await this.http.get(`manual_BaseData/searchbasedata?Plant=${plant}`)
  }

  async saveBasesata(data) {
    return await this.http.post('manual_BaseData/maintainbasedata', data)
  }

  // 新申请或维修品提交 须填写信息
  async applicationRepair(data) {
    return await this.http.post('newApply/applicationinfo', data)
  }

  // 获取新申请或运输的table资料
  async getNewApplyBaseData(data) {
    // return await this.http.get(`newApply/BaseData?Material_No=${data.Material_No}&ModelFamily=${data.Project_Code}&Plant=${data.Plant}`)
    return await this.http.get(`newApply/BaseData?Material_No=${data.Material_No}&ModelFamily=${data.Project_Code}
    &Plant=${data.Plant}&Battery_PN=${data.Battery_PN}&Use_Year=${data.Demand_Year}
    &Transport_Mode=${JSON.stringify(data.Transport_Mode)}&Project_Code=${data.Project_Code}
    &Shipment_Books=${data.Shipment_Books}`)
  }

  // 提交新申请或者维修品的基本资料
  async generateTask(data) {
    return await this.http.post('newApply/BasedataInsert', data)
  }

  // 获取新申请和维修品已存在的数据
  async getExist(data) {
    return await this.http.post('newApply/getExist', data)
  }
  // 获取 申请 模块里的延期和运输的table资料
  async getPostponeTransport(data) {
    return await this.http.post('common/SearchDefer', data)
  }

  // 申请模块里的延期申请
  async applyForDefer(data) {
    return await this.http.post('Defer/ApplyForDefer', data)
  }

  // 空转海
  async airToSea(data) {
    return await this.http.post('transport/airToSea', data)
  }

  //获取跌落报告的资料
  async getDropReport(data) {
    return await this.http.get(`manual_FalloffReport/searchFilter?Plant=${data.PlantCode}&Project_Code=${data.Material_No}&Battery_PN=${data.Project_Code}`)
  }

  async getDeclare(data) {
    return await this.http.get(`manual_ConsistentReport/searchFilter?Plant=${data.PlantCode}&Use_Year=${data.Material_No}`)
  }

  async uploadPdf(data) {
    return await this.http.post(
      `pdfFileUpload?Plant=${data.Plant}&Project_Code=${data.Project_Code}&Battery_PN=${data.Battery_PN}&Use_Year=${data.Use_Year}`,
      data.pdf)
  }

  //Plant \Project_Code \Special_SKU \PhotoType \place
  async uploadPhoto(data) {
    return await this.http.post(
      `files/${data.Plant}_${data.Project_Code}_${data.Special_SKU}_${data.PhotoType}_${data.place}`,
      data.file)
  }

  async dropNewAdd(data) {
    return await this.http.post(`manual_FalloffReport/NewAdd`, data)
  }

  async declareNewAdd(data) {
    return await this.http.post(`manual_ConsistentReport/NewAdd`, data)
  }

  async getDropPdf(data) {
    return await this.http.post(`manual_FalloffReport/checkPhoto`, data)
  }

  async downDeclarePdf(data) {
    return await this.http.post(`manual_ConsistentReport/checkPhoto`, data)
  }

  async deleteDeclarPdf(data) {
    return await this.http.get(`manual_ConsistentReport/delete?Plant=${data.Plant}&Use_Year=${data.Use_Year}`)
  }

  async productPackingNewAdd(data) {
    return await this.http.post('manual_Package/NewAdd', data)
  }

  async productPackingEdit(data) {
    return await this.http.post(`manual_Package/edit`, data)
  }

  async getProductPackingPhoto(data) {
    return await this.http.post('manual_Package/checkPhoto', data)
  }

  async deleteProductPacking(data) {
    return await this.http.get(`manual_Package/delete?Plant=${data.Plant}&Project_Code=${data.Project_Code}&Special_SKU=${data.Special_SKU}`)
  }

  async getBatteryInfo(data) {
    return await this.http.get(`batteryInfo/searchFilter?Plant=${data.PlantCode}&battery_pn=${data.Material_No}`)
  }

  async getBatteryDetails(data) {
    return await this.http.get(`batteryInfo/lookOver?Plant=${data.plant}&battery_pn=${data.battery_pn}`)
  }

  async addTestimonial(data) {
    return await this.http.post('batteryInfo/Testimonial/edit/NewAdd', data)
  }

  async addUN38(data) {
    return await this.http.post('batteryInfo/UN383/edit/NewAdd', data)
  }

  async addAuthorization(data) {
    return await this.http.post('batteryInfo/Authorization/edit/NewAdd', data)
  }

  async addOther(data) {
    return await this.http.post('batteryInfo/Other/edit/NewAdd', data)
  }

  async uploadBatteryPdf(path, file) {
    return await this.http.post(`OriginFileUpload?path=${path}`, file)
  }

  async uploadBatteryPhoto(data, file) {
    return await this.http.post(`photo/${data.Plant}_${data.Battery_PN}_${data.place}`, file)
  }

  async getBatteryExist(data) {
    return await this.http.get(`batteryInfo/searchFilter?Plant=${data.Plant}&battery_pn=${JSON.stringify(data.battery_pn)}`)
  }

  async delTestimonial(data, base) {
    return await this.http.get(`batteryInfo/Testimonial/edit/delete?Plant=${base.plant}&battery_pn=${base.battery_pn}&FileName=${data.File_Name}&Testimonial_SN=${data.Testimonial_SN}`)
  }
  async delUN383(data, base) {
    return await this.http.get(`batteryInfo/UN383/edit/delete?Plant=${base.plant}&battery_pn=${base.battery_pn}&FileName=${data.File_Name}&File_Encoding=${data.File_Encoding}`)
  }
  async delAuthorization(data, base) {
    return await this.http.get(`batteryInfo/Authorization/edit/delete?Plant=${base.plant}&battery_pn=${base.battery_pn}&FileName=${data.File_Name}&Start_Date=${data.Start_Date}&End_Date=${data.End_Date}`)
  }
  async delOther(data, base) {
    return await this.http.get(`batteryInfo/Other/edit/delete?Plant=${base.plant}&battery_pn=${JSON.stringify(base.battery_pn)}&FileName=${data.File_Name}`)
  }

  async delBatteryInfo(data) {
    return await this.http.get(`batteryInfo/deleteAll?Plant=${data.plant}&battery_pn=${data.battery_pn}`)
  }

  async upBatteryPhotoInfo(data) {
    return await this.http.post(`batteryInfo/Testimonial/edit/PhotoNewAdd`, data)
  }


  // alskdlfklasklfkwaeopjfoanweufiajruifrsejigaeoigereigaefklrel
  /* 鉴定书上传 */
  async systemMission(data) {
    return await this.http.get(`testimonial/systemMission?Testimonials_SN=${data}`)
  }
  async searchFilter(data) {
    return await this.http.post('testimonial/searchFilter', data)
  }
  async noSystemMission(data) {
    return await this.http.post('testimonial/noSystemMission', data)
  }
  async originFileUpload(data) {
    return await this.http.post('OriginFileUpload?path=Task_Testimonial', data)
  }
}
