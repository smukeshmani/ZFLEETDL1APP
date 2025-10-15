var string = "";
var approval_lvl = "";
var task = "";
sap.ui.define(
	[
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/BindingMode",
    "sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState",
    "sap/m/MessageToast",
    "sap/ui/core/library"
   ], 
   
   function (Controller,JSONModel, BindingMode, Message, MessageType , ValueState , MessageToast, library) {
	"use strict";

	return Controller.extend("ZGBC_DELIVERY_TRUCK_APPROVE.ZGBC_DELIVERY_TRUCK_APPROVE.controller.View1", {
	onInit: function () {
		            var oMessageManager,oView;
		            oView = this.getView();
		            oMessageManager = sap.ui.getCore().getMessageManager();
		            oView.setModel(oMessageManager.getMessageModel(), "message");
		            
		            
		            
		            //Local model 1 for employee details
		            var oData_result = {
		            	         ApprovalLvl:"",
		            	         Comments:""
		                        };
		             this.oLocalModel =  new sap.ui.model.json.JSONModel(oData_result);
		             oView.setModel(this.oLocalModel,"localModel");
		             
		             
		            //Local model 2 for vehicle dropdown
		            var vehicleDD = {
		            	                Vehicles : [],
		            	                VehicleSelected  :null,
		              	                VehicleDDVisible :false,
		              	                VehicleSelectVis :false,
		              	                MsgVisible       :false,
		              	                MsgType          :'Success',
		              	                MsgText          :""
		                             };
		            this.oLocalModel2 = new sap.ui.model.json.JSONModel(vehicleDD);
		            oView.setModel(this.oLocalModel2,"localModel2"); 
		            
		            
		            
		            //Local model 3 for approval checks
		            var approvalCheck = {
		             	                  ApprovalChecksVisible:false,
		              	                  VehicleDetVisible:false,
		              	                  FleetExists:false,
		              	                  UnitAllocated:false,
		              	                  SumitRequestVisible:false
		                                };
		            this.oLocalModel3 = new sap.ui.model.json.JSONModel(approvalCheck);
		            oView.setModel(this.oLocalModel3,"localModel3");     
		            
		            var oVehicleData = {
				            	         Vehicleid:"",
				            	         VehicleName:"",
				            	         VehicleVendor:"",
				            	         VehicleNumber:"",
				            	         Plant:"",
				            	         Location:"",
				            	         CostCenter:""
		                             };
		            this.oLocalVhModel =  new sap.ui.model.json.JSONModel(oVehicleData);
		            oView.setModel(this.oLocalVhModel,"localVhModel");
		            
		            
		            
		            //Retrive the URL Parameters
					var url = window.location.href;
					//var pieces = complete_url.split("?");
					var pieces = url.split("?");
					var length = pieces.length;
					length = length - 1;
					var param1 = pieces[length].split("&");
					var param2 = param1[0].split("=");
					string = param2[1]; 
					var RequestId = string;//.substr(0, 10);
					
				    param2 = param1[1].split("=");
					string = param2[1]; 
					var Workitemid = string;//.substr(0, 12);
					
					param2 = param1[2].split("=");
					string = param2[1]; 
					var Task_id  = string;//.substr(0, 12);
				 
				    //ODATA CALL TO RETRIVE THE APPROVAL LEVEL
		             var sPath = "/WorkitemSet('" +Workitemid+ "')";
				     var oModel = oView.getModel();
				     var that = this;
				     oModel.read(sPath,
				                        {
					                  	 success: function(oData, response){
					                 	 that.getView().getModel("localModel").setProperty("/ApprovalLvl", oData.ApprovalLvl);
					                 	 approval_lvl = that.getView().getModel("localModel").getProperty("/ApprovalLvl");

							             task = Task_id;
							             //START OF ODATA CALL TO RETRIVE THE EMPLOYEE INFORMATION
							             sPath = "/FleetRequestHeaderSet('" +RequestId+ "')";
							             oModel.read(sPath,
							                        {
					                                urlParameters: {
					                               "$expand": "RequestHeaderToItemNav"
					                                               },
								                 	success: function(oData1, response1){
									                       	     var oModel3 = new sap.ui.model.json.JSONModel(oData1);
										                         var osf = that.getView().byId("IdEmpDetail");
										                         osf.setModel(oModel3);
										                         if( approval_lvl === "FLM" )
					                                              {
					                                               that.getView().getModel("localModel3").setProperty("/VehicleDetVisible",false);
					                                               that.getView().getModel("localModel3").setProperty("/SumitRequestVisible",true);
					                                                //START OF ODATA CALL FOR VEHICLE DROPDOWN
											                        sPath = "/VehicleDropDownSet";
											                        var filter_string =  "RequestId eq '" +RequestId+ "' and ApprovalLbl eq '" +approval_lvl+"'";
											                        oModel.read(sPath, {
													                                urlParameters: {
																				   	   "$filter" : filter_string
																					  			   }, 
																	                success: function (oData3, response3){
																				             	that.oLocalModel2.setProperty("/Vehicles",oData3.results);
																                                that.oLocalModel2.setProperty("/VehicleDDVisible",true);
																                                that.oLocalModel2.setProperty("/VehicleSelectVis",true);
																                                
																		                                                 },
															                         error: function () {
															                         	        that.oLocalModel2.setProperty("/VehicleSelectVis",true);
																								that.oLocalModel2.setProperty("/VehicleDDVisible",false);
																		                        that.oLocalModel2.setProperty("/MsgType","Success");
																		                        that.oLocalModel2.setProperty("/MsgVisible",true);
																		                        that.oLocalModel2.setProperty("/MsgText","No vehicles found to select, So please save the data and approve to pass it to next level");
																								
																										}  });//END OF ODATA CALL TO GET THE VEHICLE LIST
					                                            }
								                 	},    
											        error: function () {
					                                            that.getView().getModel("localModel").setProperty("/VehicleDetVisible",false);
													     	    sap.m.MessageToast.show("No Data retreived");
												                    } 
							                        	
							                        });
					                  	 },
					                     error: function () {
					                		               }
		                               	});         
                               	
                     }, //END OF ON INIT FUNCTION
				                     
                     onSelectVehicle: function( oEvent){
											var vehicle_selected = this.getView().getModel("localModel2").getProperty("/VehicleSelected");
											var oModel = this.getView().getModel();
											var sPath = "/VehicleDetails3Set('" +vehicle_selected+ "')";
											var that = this;
											
		                  oModel.read(sPath, {
					                 success: function (oData, response){
					                                 that.oLocalVhModel.setProperty("/Vehicleid",oData.VehicleId);
								                     that.oLocalVhModel.setProperty("/VehicleName",oData.VehicleText);
								                     that.oLocalVhModel.setProperty("/VehicleVendor",oData.VehicleVendor);
								                     that.oLocalVhModel.setProperty("/VehicleNumber",oData.VehicleNo);
								                     that.oLocalVhModel.setProperty("/Plant",oData.VehiclePlant);
								                     that.oLocalVhModel.setProperty("/Location",oData.VehicleLoc);
								                     that.oLocalVhModel.setProperty("/CostCenter",oData.VehicleCc);
								                     that.oLocalModel2.setProperty("/VehicleDDVisible",true);
										             that.getView().getModel("localModel3").setProperty("/VehicleDetVisible",true);
			                 	                                       },
					                error: function () {
	     			                            	sap.m.MessageToast.show("No Data retreived");
							                        	}  });
				 	},
                     
                     onSubmitRequest  : function () {
                     	 var request_id = this.getView().byId("idRequestId").getText();
                     	 var vehicle_id = this.getView().byId("IdSelectedVehicle").getSelectedKey();
                         var approve_request = {
                     	 	                    RequestId    : request_id,
                     	 	                    ApprovalLvl  : approval_lvl,
                     	 	                    FlmVehicleId : vehicle_id
                     	                        };
                     	    var oModel = this.getView().getModel();
		                	var that   = this;                      
                     	    oModel.create("/ApproveSet", approve_request,{
                     	                                            success: function(oData , response){
                     	    	                                              sap.m.MessageToast.show("Delivery Vehicle Request Has Been Saved Successfully");
                     	    	                                              that.getView().getModel("localModel3").setProperty("/SumitRequestVisible",false);
                     	    	                                              
                     	                                                                               },  
                     	                                             error: function(oError) {
													                            var error_msg =  jQuery.parseJSON(oError.responseText).error.message.value;
										    	                                sap.m.MessageToast.show(error_msg);
										                                        return;
												                                            } 
                     	    	
                     	    });                                   
                     	
                     }
	});
});