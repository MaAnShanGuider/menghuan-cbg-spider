import string
import re
import requests
import time

import execjs

node = execjs.get() 


# regex = re.compile(r"[\xA0\u1680\u180E\u2000-\u200A\u202f\u205f]")
regex = re.compile(r"[\xA0\u1680\u2000-\u200A\u202f\u205f]")
ctx = execjs.compile(open('./create_page_session_id.js','r',encoding='utf-8').read())
# ctx2 = execjs.compile(regex.sub("",content))
# wodiu = open('./wocalie2.js','r',encoding='utf-8').read() .encode('GBK','ignore').decode('GBk') 
# wodiu = open('./wocalie2.js','r',encoding='utf-8').read()
# print(wodiu)
# ctx2 = execjs.compile(wodiu)
ctx3 = execjs.compile(open('./wocalie2.js','r',encoding='utf-8').read())

sign = ctx.eval("le()")

encParams = ctx3.eval("createEncParams()")
# encParams = ctx2.eval("createEncParams()")
print(encParams)
# print(encParams)
class SimulateLogin:

	processStatus = 1 # 流程状态： 如果为1就表示可以往下走，不为1，那么就不执行

	timeout = 5

	loginInfoUrl = "https://xyq-m.cbg.163.com/cgi/api/get_login_info"
	mainInitUrl = "https://dl.reg.163.com/dl/zj/mail/ini"
	pageSessionId =  ctx.eval("le()")
	loginUrl = "https://xyq-m.cbg.163.com/cgi/api/login" # 登陆接口 Post
	bindRoleUrl = "https://xyq-m.cbg.163.com/cgi/api/chose_role" # 绑定角色 Post
	updateStatusUrl = "https://xyq-m.cbg.163.com/cgi/api/login_auto" # 更新登入状态 Get
	getRecommendListUrl = "https://xyq-m.cbg.163.com/cgi-bin/recommend.py" # 列表接口

	loginReqDts = {"username": "1436089483@qq.com","page_session_id": "0181A946-984D-9819-D238-2D1AF5854F64" } # 登录接口data
	bindRoleReqDts = {"roleid": "42338280","serverid":"416", "page_session_id": "0181A946-984D-9819-D238-2D1AF5854F64" } # 绑定角色data
	updateStatusReqDts = {"view_loc":'equip_list|{"tag": "softmax_fm_slim_with_c_h_price_pdg"}',"page_session_id":"0181A946-984D-9819-D238-2D1AF5854F64","_":str(int(time.time()))} # 更新登录状态params
	getRecommendListReqDts = {
		"callback":"jQuery33105235710525002282_" + str(int(time.time())),
		"act":"recommd_by_role",
		"client_type":"h5",
		"count":"15",
		"view_loc":"search_cond",
		"search_type":"overall_role_search",
		"pet_match_all":"1",
		"perform_match_all":"1",
		"xiangrui_match_all":"1",
		"limit_clothes_logic":"1",
		"limit_clothes_logic":"1",
		"serverid":"416",
		"order_by":"",
		"order_by":"",
		"page": "1",
		"page_session_id": "0181A946-984D-9819-D238-2D1AF5854F64",
		"_": "1656394572957",
		} # 获取接口

	loginHeaders = { # 登录接口请求头
		"accept": "application/json, text/javascript, */*; q=0.01",
		"accept-encoding": "gzip, deflate, br",
		"accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
		"cache-control": "no-cache",
		"content-length": "81",
		"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
		# "cookie":  NTES_SESS=",
		"origin": "https://xyq-m.cbg.163.com",
		"pragma": "no-cache",
		"referer": "https://xyq-m.cbg.163.com/cgi/mweb/show_login",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
		"x-requested-with": "XMLHttpRequest",
	}
	loginCookie = {
		"_flow_group": "g9",
		"vjuids": "5190c7d9.163457a8911.0.62cb55118f42",
		"_ntes_nuid": "87435b82ae0ae7a8711f2b21989860ce",
		"vjlast": "1525879048.1539873477.12",
		"mail_psc_fingerprint": "80a8d6b8bf06047fece1fbd1243c6f63",
		"nts_mail_user": "1436089483@163.com:-1:1",
		"_ga": "GA1.2.956666770.1597156669",
		"_ntes_nnid": "87435b82ae0ae7a8711f2b21989860ce,1630849634304",
		"timing_user_id": "time_y4JiVorB2c",
		"_flow_group": "g4",
		"is_log_active_stat": "1",
		"_external_mark": "direct",
		"fingerprint": "lh677lnfi5jzoqyr",
		"trace_session_id":  str(int(round(time.time() * 1000))),
		"NTES_P_UTID": "VOkylRIDQUWWpRdS6z7MHluqdZlBR9Q9|" + str(int(time.time())),
		"NTES_SESS": "Bpzg.qyuuuC6HnSMHChdKWXWtnxtqVJzKiHTPy0rPWb4VQXFV_orx56QsOZNjtKB4P1HOM9dAhZf53TA.QYiw5YFz.A7p70WCTjVrfj.lcvw9WNw2i2q4CU7tN2RZ7_vPX3Dxkvm9_FywZ__K0DKh5vV9I5TcDy42HoVKjOBmH2AdyplYK3tKLUmJj7.ZOC24JKPnXndNXq1434ajCIkQWleJ",
		"NTES_PASSPORT": "UngIC0bx43LLxv0LXeDyeqcF59NV9YYP1y6VyJ2.X27NkrW0kCD17oFrg5wpUmv.dqEN5V3i2SwBSSqvgdOJxC8lKF_tOC80cLsY4Y0RfzuQn_5eFBS14ocahBSniXKI88nUS7va7hKRG716dsDYAnFyHe3xv1shA4OV0gnWBrGnRE7sG1kNg9o.Ru8aEWCV1",
		"S_INFO": str(int(time.time())) + "|0|##|1436089483@qq.com",
		"P_INFO": "1436089483@qq.com|" + str(int(time.time()))+ "|1|cbg|00&99|zhj&"+ str(int(time.time())) +"&cbg#zhj&330100#10#0#0|&0|cbg|1436089483@qq.com" ,
	}
	commonCookie = {} # 后续的公共cookie

	def __init__(self) -> None:
		print("-----初始化时间戳-----")

		self.initTimeStamp() 
		print("-----开始执行-----")
		self.getLoginInfo()
		self.mainIni();
		# self.login() # 先跑登录

		# self.bindRole() # 再跑绑定角色
		# self.getRecommendList() # 获取列表
	
	
		pass
	def getLoginInfo(self)->None: # 获取用户信息
		try:
			print("-----获取登陆数据-----")
			res = requests.get(self.loginInfoUrl, params={"page_session_id": self.pageSessionId})
			self.commonCookie.update(requests.utils.dict_from_cookiejar(res.cookies))
			result = res.json()
			print(result)
			# if result["status"] == 0 :
			# 		raise 
				
			# if (result["status"] == 8 or result["status"] == 2):
			# 	self.updateStatus()
		except Exception:
			print("-----获取登陆数据失败-----")
		pass
	def mainIni(self)->None: #初始设置token
		try:
			
			print("-----初始设置token----")
			res = requests.post(self.mainInitUrl, data={"encParams": encParams}, cookies=self.commonCookie)
			self.commonCookie.update(requests.utils.dict_from_cookiejar(res.cookies))
			result = res.json()
			print(result)
			# if result["status"] == 0 :
			# 		raise 
				
			# if (result["status"] == 8 or result["status"] == 2):
			# 	self.updateStatus()
		except Exception:
			print("-----获取初始token-----")
		pass
	def login(self)->None: # 跑登录接口
		try:
			print("-----执行登录-----")
			res =  requests.post(self.loginUrl, data=self.loginReqDts,headers=self.loginHeaders, cookies=self.loginCookie, timeout=self.timeout)
			self.commonCookie.update(requests.utils.dict_from_cookiejar(res.cookies))
			print("-----登录响应-----")
			result = res.json()
			print(result)
			if result["status"] == 0 :
				raise 
			
			if (result["status"] == 8 or result["status"] == 2):
				self.updateStatus()
			# self.updateStatus()
		except Exception:
			print("-----登陆失败-----")

		pass
	def bindRole(self)->None: #绑定角色
		if self.processStatus == 1:

			print("-----执行绑定-----")
			res = requests.post(self.bindRoleUrl,data=self.bindRoleReqDts, headers=self.loginHeaders, cookies=self.commonCookie, timeout=self.timeout )
			self.commonCookie.update(requests.utils.dict_from_cookiejar(res.cookies))
			print("-----绑定响应-----")
			result = res.json()
			print(result)
			if result["status"] == 8:
				self.updateStatus()
		pass
	def getRecommendList(self)->None: # 获取列表接口
		if self.processStatus == 1:
		
			print("-----执行列表-----")
			res = requests.get(self.getRecommendListUrl,params=self.getRecommendListReqDts, headers=self.loginHeaders, cookies=self.commonCookie, timeout=self.timeout )
			self.commonCookie.update(requests.utils.dict_from_cookiejar(res.cookies))
			print("-----列表响应-----")
			result = res.text # 列表这玩意不是json， 而是jsonp
			print(result)
			if result["status"] == 8:
				self.updateStatus()
		pass
	def updateStatus(self)->None: # 更新登录状态
		try:
			print("-----更新登录状态-----")
			res = requests.get(self.updateStatusUrl,params=self.updateStatusReqDts, headers=self.loginHeaders, cookies=self.commonCookie, timeout=self.timeout )
			self.commonCookie.update(requests.utils.dict_from_cookiejar(res.cookies))
			print(res.text)
			self.processStatus = 1
		except requests.exceptions.RequestException as e:
			self.processStatus = 0
			print("报错了",e) 
		
		pass
	def resetTimeStamp(self)->string: # 重置时间戳
		ctx = execjs.compile(open('./create_page_session_id.js','r',encoding='utf-8').read())
		sign = ctx.eval("le()")

		return sign
	def initTimeStamp(self)->None: # 初始化时间戳
		sign = self.resetTimeStamp()
		self.loginReqDts["page_session_id"] = sign
		self.bindRoleReqDts["page_session_id"] = sign
		self.updateStatusReqDts["page_session_id"] = sign
		self.getRecommendListReqDts["page_session_id"] = sign
		self.getRecommendListReqDts["_"] = self.getTimeStamp()

	def getTimeStamp(self)->int: # 获取13位时间戳
		# current_milli_time = lambda: int(round(time.time() * 1000))

		return int(round(time.time() * 1000))
apiInstance =  SimulateLogin()


# print(int(round(time.time() * 1000)))
