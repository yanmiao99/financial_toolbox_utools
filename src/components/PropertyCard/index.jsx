import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './index.less';

const PropertyCard = ({ cardData }) => {
  if (!cardData) return null;

  // 计算总金额
  const totalAmount = cardData.propertyDetails?.reduce((sum, detail) => {
    return sum + (detail.amount || 0);
  }, 0) || 0;

  // 计算收入和支出
  const income = cardData.propertyDetails?.reduce((sum, detail) => {
    return detail.amount > 0 ? sum + detail.amount : sum;
  }, 0) || 0;

  const expense = cardData.propertyDetails?.reduce((sum, detail) => {
    return detail.amount < 0 ? sum + Math.abs(detail.amount) : sum;
  }, 0) || 0;



  return (
    <Card 
      className="property_card"
      hoverable
      title={
        <div className="card_header">
          <div className="card_avatar">
            {cardData.bgText || cardData.title?.charAt(0)}
          </div>
          <div className="card_title">
            {cardData.title}
          </div>
        </div>
      }
    >
      <div className="card_content">
        <div className="total_amount">
          <Statistic
            title="总金额"
            value={totalAmount}
            precision={2}
            valueStyle={{
              color: totalAmount >= 0 ? '#3f8600' : '#cf1322',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
            prefix={totalAmount >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="¥"
          />
        </div>
        
        <div className="amount_details">
          <div className="income_section">
            <Statistic
              title="收入"
              value={income}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '16px' }}
              prefix={<ArrowUpOutlined />}
              suffix="¥"
            />
          </div>
          
          <div className="expense_section">
            <Statistic
              title="支出"
              value={expense}
              precision={2}
              valueStyle={{ color: '#cf1322', fontSize: '16px' }}
              prefix={<ArrowDownOutlined />}
              suffix="¥"
            />
          </div>
        </div>
        
        <div className="transaction_count">
          <span className="count_text">
            共 {cardData.propertyDetails?.length || 0} 笔交易
          </span>
        </div>
      </div>
    </Card>
  );
};

PropertyCard.propTypes = {
  cardData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    bgText: PropTypes.string,
    propertyDetails: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number
      })
    )
  })
};

export default PropertyCard;