import string
import re
import requests
import time
import json
import execjs

node = execjs.get() 


regex = re.compile(r"[\xA0\u1680\u2000-\u200A\u202f\u205f]")
ctx = execjs.compile(open('./create_page_session_id.js','r',encoding='utf-8').read())
ctx3 = execjs.compile(open('./wocalie2.js','r',encoding='utf-8').read())
sign = ctx.eval("le()")
encParams = ctx3.eval("createEncParams()")
page_session_id = ctx.eval("le()")
print(encParams)
class SimulateLogin:

	processStatus = 1 # 流程状态： 如果为1就表示可以往下走，不为1，那么就不执行

	timeout = 5

	loginInfoUrl = "https://xyq-m.cbg.163.com/cgi/api/get_login_info"
	mainInitUrl = "https://dl.reg.163.com/dl/zj/mail/ini"
	pageSessionId = page_session_id
	loginUrl = "https://xyq-m.cbg.163.com/cgi/api/login" # 登陆接口 Post
	bindRoleUrl = "https://xyq-m.cbg.163.com/cgi/api/chose_role" # 绑定角色 Post
	updateStatusUrl = "https://xyq-m.cbg.163.com/cgi/api/login_auto" # 更新登入状态 Get
	getRecommendListUrl = "https://xyq-m.cbg.163.com/cgi-bin/recommend.py" # 列表接口

	loginReqDts = {"username": "1436089483@qq.com","page_session_id": page_session_id } # 登录接口data
	bindRoleReqDts = {"roleid": "42338280","serverid":"416", "page_session_id": page_session_id } # 绑定角色data
	updateStatusReqDts = {"view_loc":'equip_list|{"tag": "softmax_fm_slim_with_c_h_price_pdg"}',"page_session_id":page_session_id,"_":str(int(time.time()))} # 更新登录状态params
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
		"page_session_id": page_session_id,
		"_": "1656394572957",
		} # 获取接口
	initHeaders = { # ini接口请求头
		"Accept": "*/*",
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
		"Content-Length": "656",
		"Content-Type": "application/json",
		"Host": "dl.reg.163.com",
		"Origin": "https://dl.reg.163.com",
		"Pragma": "no-cache",
		"Referer": "https://dl.reg.163.com/webzj/v1.0.1/pub/index2_new.html?cd=https%3A%2F%2Fcbg-xyq.res.netease.com&cf=%2Fmvvm%2Frc7a2b43adc050ccccea62a095%2Fdist%2Fcss-urs-login-7b22a7.css&MGID=1665213889338.0938&wdaId=&pkid=aqpOBwV&product=cbg",
		"Sec-Fetch-Dest": "empty",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Site": "same-origin",
		# "Cookie": "utid=0xWu928XoUJ9n7f85ARpNs6P78VQX4aC; _ntes_nnid=ab6e32d57e25c8c5d9fe776ded78b206,1660525435299; _ntes_nuid=ab6e32d57e25c8c5d9fe776ded78b206; NTES_CMT_USER_INFO=474728375%7C%E6%9C%89%E6%80%81%E5%BA%A6%E7%BD%91%E5%8F%8B0siYuT%7Chttp%3A%2F%2Fcms-bucket.nosdn.127.net%2F2018%2F08%2F13%2F078ea9f65d954410b62a52ac773875a1.jpeg%7Cfalse%7CenNramhmc0AxNjMuY29t; NTES_WEB_FP=b857c426e67fc571c97935f35a420774; l_s_cbgaqpOBwV=50D7EFE8E1E36B32F3B9CF3038C36652EE93F61E86B277ADE4DFA342BCE3E3B7E7AEFB93A8AFF644CD196BAE92FC5073A0EC6F5D12A6CE24A55481CE941EC29B05D180C74409739D77F52210565D2A026D8295F97F1388D26E310360FAD0854C; l_s_godlike_webfDydrIe=5CAA8EDB2EA995C5CFA313E7B11B9B603EA9E8B2307D95B33DAA1769FF96022A630E272B1DBA02CE071D8F3442DEFD090CED6C83DBB8C0AB5D12C400631DCEAA8897229048064BC06C3EB744D19B297C7DC2AE14A464666194FB6E6033B154160B576255A6E07FC649E03813DB5355C2; l_yd_s_godlike_webfDydrIe=5CAA8EDB2EA995C5CFA313E7B11B9B603EA9E8B2307D95B33DAA1769FF96022A630E272B1DBA02CE071D8F3442DEFD0908629159D28E37297BFD08C67314E13AB507C70B4670A112F1BC7127FDD6A9615EDFA861B995AA2247BA80497FA370E5E1C7EA934E44CAB2633E2D0866AF35D0; gdxidpyhxdE=dAAM%5CZbY%2Fq9mbOKu9IPENxMSMTH7LMgEIZtpg6JfhVJkOm94fmBWTNYz8E6deLnS2GwbhP%2B5bixh34ik7ZwInKo5wjKiJlmI2%2FpPBatosfWolpHxxUBdGOAjbanlRg%2FK%2BEKcAmjTfWEi24LlWx6uegWwKG1Jw5%2Bzh92BbCVkZcl2s1rd%3A1665212944863; _9755xjdesxxd_=32; YD00000710348764%3AWM_NI=KHCtT3LRvEBo%2FLFV9LVrmg%2BaZ5tX2%2Fjio%2FnZEM7Ayxd4xhce7lJR1VeAzIUrBLU49XlCcadgejCJi61yl24urybKeb8GXPZIi4dRdtfiC2waEdPXkbXsbSv%2B%2BKtixpXQaUM%3D; YD00000710348764%3AWM_NIKE=9ca17ae2e6ffcda170e2e6ee88eb41f8b7fab1b749aa8e8fa2c45b969b8eadd544b4eba1aeaa34bb918585d22af0fea7c3b92a89988d95d739908ebaa6c165ed948ab7bc4896aea388aa6b9aebbcb9b125aab7a1d0ed528793f9a2fc74a8ecb889e26ff5b486b3b45ea79fb6aad87a82949bd5bc54b09dad82e76da7b68dabec3ef3a7a4d3b77fb2a7aeace86afc9998b1d943abecacb3e780a6b78dd3f66b87bca0b9ea6a9cadaeb4f521e995bc8afb7c9c8fafb6d037e2a3; YD00000710348764%3AWM_TID=rfhiiPieLjFERVBARBOVSostIq8yfaMH",
		"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
			}
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
			print(self.commonCookie)
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
			print(encParams)

			res = requests.post(
				self.mainInitUrl,
				headers=self.initHeaders, 
				# data=json.dumps({"encParams":"e7a3d4c8fe98587c99be7f282b26cf006d65c51b439ccae8f652efecdba169ab0a6d30ac13ad5029c570494d34a1771ab6d3154c6e57ac48c09370303ea6760afcd4b3793b5525952aad1f4b3c2266fc14264324eb456e0e4f1a92f8ed88b2b4f2af001d3aa138bf6635df14f21b249e63978af0fa8ccc979159725d8343a2066ebd0feb296a28ee4c881ac78f02ab484a5c2353316bfd9557bb1253bacfc00b4668b89f846235f1a92a318e9fac101afb5bfe4c24790edcceabfaed3ec94fad5a823e21866399e4e5c7a1a31259854b97a44997b871c8c18e02162992ba2a6f38531a7ad631a75d445905baa763000957a22d79dcfa6f36817d2b65d854e6ffb0284e50bcb5b40dba211d98c660e497496c1e0b7ab0780a38e5955bb24ff7abc327a97be7553d4c7fc1bd4e2993b6593e147ed0a29d696d4b5adf1132758c39" }), 
				data=json.dumps({"encParams": encParams }), 
				# data={"encParams":encParams }, 
				cookies=self.commonCookie
				)
			self.commonCookie.update(requests.utils.dict_from_cookiejar(res.cookies))
			result = res.json()
			print(result)
		except Exception as e:
			print("-----初始设置token报错-----")
			print(e)
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
