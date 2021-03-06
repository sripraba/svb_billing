var searchOver=0,searchLen,searchPntr=1,customerWin=payment=window,round_off=0;
$(document).ready(function(e) {
	removeItem();
	billingSettings(1);	
	$(document).keydown(function(e){
		if (!e) var e = window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode == 13 ) { 
		e.preventDefault();
	  	}
	});
	$(".searchBox").bind("mouseover",function(e){
		searchOver = 1;
	});
	$(".searchBox").bind("mouseout",function(e){
		searchOver = 0;
	});
});
function billingSettings(noCalc)
{
	calcItemNet(noCalc);
	$("#MitemId").val('');
	$("#MitemName").val('');
	$("#MitemType").html('');
	$("#MitemQty").val('');
	$("#MnetAmnt").val('');
	$("#MitemAmnt").val('');
	$("#MitemVat").val('');
	$("#MoldStock").val('');
	$("#MnewStock").val('');
	$("#MitemDis").val('');
	$("#MitemName").focus();
	$("#MitemName").bind("keyup",function(e) {
		if (!e) var e = window.event;
		keyCode = e.keyCode || e.which;
		if (keyCode == 40) { 
		e.preventDefault();
		searchPntr++;
		$(".searchResult").each(function(index, element) {
			$(this).css("background-color","");
			 $(this).css("color","#444444");
		});
		if(searchPntr<=searchLen)
		{
			$("#sr"+searchPntr).css("background-color","#316cca");
			$("#sr"+searchPntr).css("color","#FFF");
					
		}
		else
		{
			searchPntr=1;
			$("#sr"+searchPntr).css("background-color","#316cca");
			$("#sr"+searchPntr).css("color","#FFF");
		}				
	  }
	  else if(keyCode == 38){
			e.preventDefault();
			searchPntr--;
			$(".searchResult").each(function(index, element) {
				$(this).css("background-color","");
				$(this).css("color","#444444");
			});
			if(searchPntr>=1)
			{
				$("#sr"+searchPntr).css("background-color","#316cca");
				$("#sr"+searchPntr).css("color","#FFF");		
			}
			else
			{
				searchPntr=searchLen;
				$("#sr"+searchPntr).css("background-color","#316cca");
				$("#sr"+searchPntr).css("color","#FFF");
			}
		}
		else if(keyCode == 13){
		  if(searchPntr == 0)
		  	searchPntr = 1;
		  $("#sr"+searchPntr).click();
		}
		else
		{
			pos = $("#MitemName").offset();
		  	searchLen=1;
			searchPntr = 0;
		  	count = 0;
		  	val = $(this).val().toLowerCase();
			rst ='';
		  	i=0;
		  	sel = Array();
		 	$.ajax({
			  type: 'POST',
			  url: 'ajax_item_search.php',
			  data: {'value':val,'src':'P'},
			  success: function(ajax_result){
				$(".searchBox").html(ajax_result);
				$(".searchResult").each(function(index, element) {
                    searchLen++;
                });
				searchLen--;
				$(".searchBox").css("left",pos.left-5);
				$(".searchBox").css("top",(pos.top+$("#MitemName").height()+6));
				$(".searchBox").css("width",$("#MitemName").width()-1);
				$(".searchBox").css("visibility","visible");
				$(".searchResult").each(function(index, element) {
				var pos = index;
				$(this).click(function(e) {
					id = $(".searchResultId:eq("+pos+")").val();
					try{
					for(i=0;i<products.length;i++)
					{
						if(products[i].id==id)
						{	
							name = products[i].name;
							type = products[i].type;
							amnt = products[i].amnt;
							vat = products[i].vat;
							oldStock = products[i].stock;
							code = products[i].pid;
							$("#MitemId").val(products[i].id);
							$("#MitemCode").val(code);
							$("#MitemName").val(name);
							units= '';
							i = 0;
							for(;i<productType.length;i++)
							{
								prst1 = productType[i].from.indexOf(type);
								if(prst1 != -1)
									break;
							}
							baseType = productType[i].to;
							i = 0;
							for(;i<productType.length;i++)
							{
								if(productType[i].to == baseType)
								{
									units +='<option>'+productType[i].from+'</option>';
								}
							}			
							$("#MitemType").append(units);
							$("#MitemType").val(type);
							$("#MitemQty").val(1);
							$("#MnetAmnt").val(amnt);
							$("#MitemAmnt").val(amnt);
							$("#MitemVat").val(vat);
							$("#MoldStock").val(oldStock);
							$("#MnewStock").val(parseFloat(oldStock)+1);
							$(".searchBox").css("visibility","hidden");
							$("#MitemQty").focus();
							$("#MitemQty").select();
							break;
						}
					}
					}catch(e){alert(e)}
					calcMItemNet();
				});
			});
			  },
			  beforeSend: function(){
					$(".searchBox").html('Loading Data Please Wait....');
			  },
			  error: function( xhr, tStatus, err ) {
					
			  }
			});
		}
    });
	$("#MitemName").bind("blur",function(e){
		closeSearchBox()
	});
	$("#MitemQty").bind("keyup",function(e) {
		if (!e) var e = window.event;
		keyCode = e.keyCode || e.which;
        if(keyCode == 13){
		 $("#MitemType").focus();
		}
		else
		{
			calcMItemNet();
		}
    });
	$("#MitemQty").click("keyup",function(e) {
		$(this).select();
    });
	$("#MitemType").bind("change keyup",function(e) {
		if (!e) var e = window.event;
		keyCode = e.keyCode || e.which;
        if(keyCode == 13){
		 
		if (!e) var e = window.event;
		keyCode = e.keyCode || e.which;
        if(keyCode == 13){
			 itemId = $("#MitemId").val();
			 itemName = $("#MitemCode").val()+'-'+$("#MitemName").val();
			 itemQty = parseFloat($("#MitemQty").val());
			 itemNet = parseFloat($("#MnetAmnt").val());
			 itemType = $("#MitemType").val();
			 itemAmnt = parseFloat($("#MitemAmnt").val());
			 itemVat =  parseFloat($("#MitemVat").val());
			 oldStock = parseFloat($("#MoldStock").val());
			 if($("#MitemDis").val() == '')
				 itemDis=0;
			 else
				itemDis =  parseFloat($("#MitemDis").val());
			 selected =0;
			 if(itemId!='' && $("#MitemQty").val()!='')
			 {
			 $(".itemId").each(function(index, element) {
				 if(!selected)
				 {
					if($(this).val()=='')
					{
						$(this).val(itemId);
						$(".itemName:eq("+index+")").val(itemName);
						$(".itemQty:eq("+index+")").val(itemQty);
						$(".netAmnt:eq("+index+")").val(itemNet);
						$(".amnt:eq("+index+")").val(itemAmnt.toFixed(2));
						$(".itemType:eq("+index+")").html(itemType);
						$(".itemTypeT:eq("+index+")").val(itemType);
						$(".oldStock:eq("+index+")").val(oldStock);
						$(".newStock:eq("+index+")").val(parseFloat(oldStock)+parseFloat(itemQty));
						$(".itemVat:eq("+index+")").val(itemVat);
						$(".itemDis:eq("+index+")").val(itemDis);
						selected =1;
						$(".searchBox").html('');
						unbindBillSettings()
						billingSettings();
					}
					else if($(this).val() == itemId)
					{
						$(".itemQty:eq("+index+")").val(parseFloat($(".itemQty:eq("+index+")").val())+itemQty);
						$(".amnt:eq("+index+")").val((parseFloat($(".amnt:eq("+index+")").val())+itemAmnt).toFixed(2));
						$(".oldStock:eq("+index+")").val(oldStock);
						$(".newStock:eq("+index+")").val(parseFloat(oldStock)+parseFloat(itemQty));
						$(".itemType:eq("+index+")").html(itemType);
						$(".itemVat:eq("+index+")").val(itemVat);
						$(".itemDis:eq("+index+")").val(itemDis);
						selected =1;
						$(".searchBox").html('');
						unbindBillSettings()
						billingSettings();
					}
				 }
			});
			if(!selected)
			{
				addItem();
				$(".itemId").each(function(index, element) {
					if($(this).val()=='' && selected!=1 )
					{
						$(this).val(itemId);
						$(".itemName:eq("+index+")").val(itemName);
						$(".itemQty:eq("+index+")").val(itemQty);
						$(".oldStock:eq("+index+")").val(oldStock);
						$(".newStock:eq("+index+")").val(parseFloat(oldStock)+parseFloat(itemQty));
						$(".netAmnt:eq("+index+")").val(itemNet);
						$(".amnt:eq("+index+")").val(itemAmnt.toFixed(2));
						$(".itemType:eq("+index+")").html(itemType);
						$(".itemTypeT:eq("+index+")").val(itemType);
						$(".itemVat:eq("+index+")").val(itemVat);
						$(".itemDis:eq("+index+")").val(itemDis);
						selected =1;
						$(".searchBox").html('');
						unbindBillSettings();
						billingSettings();
					}
				});
			}
			}
			 else{
				 if($("#MitemQty").val()=='')
				 {
					 alert("Please Enter Qty");
					 $("#MitemName").focus();
				 }
			 }
		}
    
		}
		else
		{
			calcMItemNet();
		}
    });
	$("#MitemAmnt").bind("keyup",function(e) {
		if (!e) var e = window.event;
		keyCode = e.keyCode || e.which;
        if(keyCode == 13){
		 $("#MitemDis").focus();
		}
    });
	$("#MitemDis").bind("keyup",function(e) {
		if (!e) var e = window.event;
		keyCode = e.keyCode || e.which;
        if(keyCode == 13){
			 itemId = $("#MitemId").val();
			 itemName = $("#MitemCode").val()+'-'+$("#MitemName").val();
			 itemQty = parseFloat($("#MitemQty").val());
			 itemNet = parseFloat($("#MnetAmnt").val());
			 itemType = $("#MitemType").val();
			 itemAmnt = parseFloat($("#MitemAmnt").val());
			 itemVat =  parseFloat($("#MitemVat").val());
			 oldStock = parseFloat($("#MoldStock").val());
			 if($("#MitemDis").val() == '')
				 itemDis=0;
			 else
				itemDis =  parseFloat($("#MitemDis").val());
			 selected =0;
			 if(itemId!='')
			 {
			 $(".itemId").each(function(index, element) {
				 if(!selected)
				 {
					if($(this).val()=='')
					{
						$(this).val(itemId);
						$(".itemName:eq("+index+")").val(itemName);
						$(".itemQty:eq("+index+")").val(itemQty);
						$(".netAmnt:eq("+index+")").val(itemNet);
						$(".amnt:eq("+index+")").val(itemAmnt.toFixed(2));
						$(".itemType:eq("+index+")").html(itemType);
						$(".itemTypeT:eq("+index+")").val(itemType);
						$(".oldStock:eq("+index+")").val(oldStock);
						$(".itemVat:eq("+index+")").val(itemVat);
						$(".itemDis:eq("+index+")").val(itemDis);
						selected =1;
						$(".searchBox").html('');
						unbindBillSettings()
						billingSettings();
					}
					else if($(this).val() == itemId)
					{
						$(".itemQty:eq("+index+")").val(parseFloat($(".itemQty:eq("+index+")").val())+itemQty);
						$(".amnt:eq("+index+")").val((parseFloat($(".amnt:eq("+index+")").val())+itemAmnt).toFixed(2));
						$(".oldStock:eq("+index+")").val(oldStock);
						$(".itemType:eq("+index+")").html(itemType);
						$(".itemVat:eq("+index+")").val(itemVat);
						$(".itemDis:eq("+index+")").val(itemDis);
						selected =1;
						$(".searchBox").html('');
						unbindBillSettings()
						billingSettings();
					}
				 }
			});
			if(!selected)
			{
				addItem();
				$(".itemId").each(function(index, element) {
					if($(this).val()=='' && selected!=1 )
					{
						$(this).val(itemId);
						$(".itemName:eq("+index+")").val(itemName);
						$(".itemQty:eq("+index+")").val(itemQty);
						$(".netAmnt:eq("+index+")").val(itemNet);
						$(".amnt:eq("+index+")").val(itemAmnt.toFixed(2));
						$(".itemType:eq("+index+")").html(itemType);
						$(".itemTypeT:eq("+index+")").val(itemType);
						$(".itemVat:eq("+index+")").val(itemVat);
						$(".itemDis:eq("+index+")").val(itemDis);
						selected =1;
						$(".searchBox").html('');
						unbindBillSettings()
						billingSettings();
					}
				});
			}
			}
		}
    });
	$(".itemQty").bind("keyup",function(e){
		calcItemNet();
	});
	$(".itemQty").bind("click",function(e){
		$(this).select();
	});
	$("#discountAmnt").keyup(function(e) {
        calcItemNet();
    });
	$(".itemDis").keyup(function(e) {
		if($(this).val()=='')
			$(this).val(0)
        calcItemNet();
    });
	$(".itemDis").click(function(e) {
       $(this).select();
    });
	$("#recieved").keyup(function(e) {
        calcPayment();
    });
	$("#recieved").click(function(e) {
       $(this).select();
    });
	$("#returned").click(function(e) {
       $(this).select();
    });
}
function unbindBillSettings()
{
	$("#MitemName").unbind("keyup");
	$("#MitemQty").unbind("keyup");
	$("#MitemType").unbind("keyup");
	$("#MitemAmnt").unbind("keyup");
	$("#MitemDis").unbind("keyup");
}
function addItem()
{
	var newItem = '<tr class="itemSet">				  <td align="center" style="font-weight:bold;" class="Isno"><?php echo $i; ?></td>				  <td><input id="itemName" name="item[]" type="text" class="billText itemName"  autocomplete="off" readonly></td>				  <td><input id="itemQty" name="qty[]" type="text" title="qty" class="billText tCenter itemQty" autocomplete="off"></td>				  <td class="itemType tRight"></td>				  <td><input id="itemId" name="itemId[]" type="hidden" class="itemId">						<input id="itemVat" name="itemVat[]" type="hidden" class="itemVat">						<input id="itemTypeT" name="itemType[]" type="hidden" class="itemTypeT">						<input id="netAmnt" name="netAmnt[]" type="hidden" class="netAmnt">						<input id="oldStock" name="oldStock[]" type="text" class="billTextRight tRight oldStock" autocomplete="off" readonly >                        <input id="amnt" name="amount[]" type="hidden" class="billTextRight tRight amnt" autocomplete="off" readonly ></td>				  <td>                  <input id="newStock" name="newStock[]" type="text" class="billTextRight tRight newStock" autocomplete="off" readonly >                  <input id="itemDis" name="itemDis[]" type="hidden" class="billTextRight tRight itemDis" autocomplete="off"></td>				  <td><i class="icon-trash removeItem" style="cursor:pointer"></i></td>			</tr>';
	$("#itemSelected").append(newItem);
	removeItem();
	orderItems();
}
function orderItems()
{
	var count =1;
	$(".Isno").each(function(index, element) {
        $(this).html(count++);
    });
	calcItemNet();
}
function removeItem()
{
	$(".removeItem").click(function(e) {
        $(this).closest("tr").remove();
		orderItems();
    });
}
function closeSearchBox()
{
	if(searchOver == 0)
	{
		$(".searchBox").css("visibility","hidden");
	}
}
function addFromTray(id)
{
	unbindBillSettings();
	billingSettings();
	for(i=0;i<products.length;i++)
	{
		if(products[i].pid == id)
		{
			id = products[i].id;
			name = products[i].name;
			type = products[i].type;
			amnt = products[i].amnt;
			vat = products[i].vat;
			type = products[i].type;
			oldStock = products[i].stock;
		 }
	}
	units= '';
	i = 0;
	for(;i<productType.length;i++)
	{
		prst1 = productType[i].from.indexOf(type);
		if(prst1 != -1)
			break;
	}
	baseType = productType[i].to;
	i = 0;
	for(;i<productType.length;i++)
	{
		if(productType[i].to == baseType)
		{
			units +='<option>'+productType[i].from+'</option>';
		}
	}			
	$("#MitemType").append(units);		
	$("#MitemId").val(id);
	$("#MitemName").val(name);
	$("#MitemType").val(type);
	$("#MitemQty").val(1);
	$("#MoldStock").val(oldStock);
	$("#MnewStock").val(parseFloat(oldStock)+1);
	$("#MnetAmnt").val(amnt);
	$("#MitemAmnt").val(amnt);
	$("#MitemVat").val(vat)
	$(".searchBox").css("visibility","hidden");
	$("#MitemQty").focus();
	$("#MitemQty").select();
	calcMItemNet();
}
function calcMItemNet()
{	
	$("#MitemType").val();
	tot = $("#MitemQty").val()*$("#MnetAmnt").val()+($("#MitemQty").val()*($("#MnetAmnt").val()/100)*$("#MitemVat").val());
	newStock = parseFloat($("#MoldStock").val())+parseFloat($("#MitemQty").val());
	if($(".MitemQty").val() =='')
		newStock = parseFloat($(".MoldStock").val());
	$("#MnewStock").val(newStock);
	i=0;
	for(;i<products.length;i++)
	{
		prst1 = products[i].id.indexOf($("#MitemId").val());
		if(prst1!=-1)
		{
			break;
		}
	}
	tot = getType($("#MitemType").val(),i,$("#MitemQty").val(),tot);
	$("#MitemAmnt").val(tot.toFixed(2));
}
function getType(type,pId,val,amnt)
{
	if(type!=products[pId].type)
	{
		for(i=0;i<productType.length;i++)
		{
			if(productType[i].from == type){
				amnt =  (amnt)/productType[i].val;		
			}
		}
	}
	return parseFloat(amnt);
}
function calcPayment()
{
	net = $("#net").val();
	rvd = $("#recieved").val();
	tot = parseFloat(rvd-net);
	if(tot<0)
		tot=0
	tot = parseFloat(tot);
	$("#returned").val(tot.toFixed(2));
}
function calcItemNet(noCalc)
{
	totAmnt = 0.0;
	totNTax = 0.0;
	totDis = 0.0;
	$(".itemId").each(function(index, element) {
		if($(this).val()!='')
		{
			tot=0;
			tot =  parseFloat($(".itemQty:eq("+index+")").val()*$(".netAmnt:eq("+index+")").val()+($(".itemQty:eq("+index+")").val()*($(".netAmnt:eq("+index+")").val()/100)*$(".itemVat:eq("+index+")").val()));
			i=0;
			for(;i<products.length;i++)
			{
				prst1 = products[i].id.indexOf($(".itemId:eq("+index+")").val());
				if(prst1!=-1)
				{
					break;
				}
			}
			tot = getType($(".itemType:eq("+index+")").html(),i,$(".itemQty:eq("+index+")").val(),tot);
			totAmnt +=  parseFloat($(".itemQty:eq("+index+")").val()*$(".netAmnt:eq("+index+")").val());
			totNTax += tot;
			totDis += parseFloat($(".itemDis:eq("+index+")").val());
			newStock = parseFloat($(".itemQty:eq("+index+")").val())+parseFloat($(".oldStock:eq("+index+")").val());
			if($(".itemQty:eq("+index+")").val() =='')
				newStock = parseFloat($(".oldStock:eq("+index+")").val());
			$(".newStock:eq("+index+")").val(newStock);
			$(".amnt:eq("+index+")").val(tot.toFixed(2));
		}
    });
	netTax = parseFloat((totAmnt/100)*tax);
	net =  parseFloat(((totAmnt/100)*tax)+totAmnt);
	if($("#discountAmnt").val() == '')
		netDis = 0;
	else
		netDis = parseFloat($("#discountAmnt").val());
	finalNet = parseFloat(netTax+totNTax-totDis-netDis);
	$("#total").val(totNTax.toFixed(2));
	$("#tax").val(netTax.toFixed(2));
	$("#netdiscount").val(totDis.toFixed(2));
	if(round_off ==1)
	{
		finalNet = Math.ceil(finalNet);
	}
	else if(round_off ==2)
	{
		finalNet = Math.floor(finalNet);
	}
	else if(round_off ==0)
	{
		finalNet = Math.round(finalNet);
	}
	//$("#recieved").val(finalNet);
	//$("#returned").val(0);
	$("#net").val(finalNet.toFixed(2));
}
function clearDiscount()
{
	$("#discountAmnt").val('');
	$("#discountReason").val('');
}
function setCustomer(id,name,phone,address)
{
	$("#customerId").val(id);
	$("#customerName").html(name);
	$("#customerPhone").html(phone);
	//$("#customerAddress").html(address)
	customerWin.close();
}
function addCustomer()
{
	hei = ($(document).height())-50;
	wid = ($(document).width()/2)-398.4;
	customerWin = window.open("dealerEntry.php?doy=1","New Customer");
}
function loadCustomer()
{
	hei = ($(document).height())-50;
	wid = ($(document).width()/2)-398.4;
	customerWin = window.open("dealerLoad.php?doy=1","New Customer");
}
function openPayment()
{
	hei = ($(document).height())-50;
	wid = ($(document).width()/2)-398.4;
	payment = window.open("purchase_payment.php?doy=1","New Customer");
}
function completePayment()
{
	payment.close();
}