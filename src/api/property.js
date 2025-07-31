import request from '@/utils/request';

/** 创建组
 * @param {String} title 组名
 */
export const createPropertyGroup = (param) => {
	return request({
		method: 'post',
		url: '/property/createGroup',
		data: param,
	});
};

/** 修改组
 * @param {String} id 组id
 * @param {String} title 组名
 */
export const updatePropertyGroup = (param) => {
	return request({
		method: 'post',
		url: '/property/updateGroup',
		data: param,
	});
};

/** 删除组
 * @param {String} id 组id
 */
export const deletePropertyGroup = (param) => {
	return request({
		method: 'post',
		url: '/property/deleteGroup',
		data: param,
	});
};

/** 创建卡片
 * @param {String} title 卡片名
 * @param {String} groupId 组id
 */
export const createPropertyCard = (param) => {
	return request({
		method: 'post',
		url: '/property/createCard',
		data: param,
	});
};

/** 修改卡片
 * @param {String} id 卡片id
 * @param {String} title 卡片名
 * @param {String} groupId 组id
 */
export const updatePropertyCard = (param) => {
	return request({
		method: 'post',
		url: '/property/updateCard',
		data: param,
	});
};

/** 删除卡片
 * @param {String} id 卡片id
 */
export const deletePropertyCard = (param) => {
	return request({
		method: 'post',
		url: '/property/deleteCard',
		data: param,
	});
};

/** 查询组列表
 * @param
 */
export const getPropertyGroupList = (param) => {
	return request({
		method: 'get',
		url: '/property/getGroupList',
		data: param,
	});
};

/** 查询卡片列表
 * @param
 */
export const getPropertyCardList = (param) => {
	return request({
		method: 'get',
		url: '/property/getCardList',
		data: param,
	});
};

/** 创建卡片详情条目
 * @param {String} cardId 卡片id
 * @param {String} amount 金额
 * @param {String} date 日期
 * @param {String} remark 备注
 */
export const createCardDetail = (param) => {
	return request({
		method: 'post',
		url: '/property/createCardDetail',
		data: param,
	});
};

/** 查询卡片详情条目
 * @param {String} cardId 卡片id
 * @param {String} remark 备注
 * @param {Number} page 页码
 * @param {Number} limit 每页数量
 */
export const getCardDetailList = (param) => {
	return request({
		method: 'get',
		url: '/property/getCardDetailList',
		data: param,
	});
};

/** 删除卡片详情条目
 * @param {String} id 详情id
 */
export const deleteCardDetail = (param) => {
	return request({
		method: 'post',
		url: '/property/deleteCardDetail',
		data: param,
	});
};

/** 修改卡片详情条目
 * @param {String} id 详情id
 * @param {String} amount 金额
 * @param {String} date 日期
 * @param {String} remark 备注
 */
export const updateCardDetail = (param) => {
	return request({
		method: 'post',
		url: '/property/updateCardDetail',
		data: param,
	});
};

// 计算利息
// export const getTotalInterest = (param) => {
// 	return request({
// 		method: 'get',
// 		url: '/property/getTotalInterest',
// 		data: param,
// 	});
// };
