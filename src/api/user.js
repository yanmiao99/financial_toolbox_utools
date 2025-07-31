import request from '@/utils/request';

// 登录
export const userLogin = (param) => {
	return request({
		method: 'post',
		url: '/user/login',
		data: param,
	});
};

// 注册
export const postRegister = (param) => {
	return request({
		method: 'post',
		url: '/user/register',
		data: param,
	});
};

// 获取用户信息
export const getCurrentUserInfo = () => {
	return request({
		method: 'get',
		url: '/user/current',
	});
};
