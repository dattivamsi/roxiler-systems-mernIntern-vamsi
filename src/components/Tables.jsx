import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select, Space, Table, message } from "antd";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";

const Tables = () => {
  const [transactionData, setTransactionData] = useState({});
  const [selectMonth,setSelectMonth] = useState("")
  const [search,setSearch] = useState("")
  const [chartsData,setChartsData] = useState({})
  const [chartsMonth,setChartsMonth] = useState("January")

  const columns = [
    {
      title: "S No",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 350,
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 350,
    },
    {
      title: "sold",
      dataIndex: "sold",
      key: "sold",
      width: 100,
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      width: 350,
      render: (data) => (
        <>
          <img
            src={data}
            alt={data}
            style={{ height: "4rem", width: "4rem" }}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    fetch("http://localhost:3000/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTransactionData(data);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/api/combined?month=${chartsMonth}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setChartsData(data);
      });
  }, [chartsMonth]);

  const handlePagination = (pageno, pageSize) => {
    console.log(pageno, pageSize);
    fetch(
      `http://localhost:3000/api/transactions?page=${pageno}&perPage=${pageSize}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTransactionData(data);
      });
  };

  const handleChange = (e) =>{
    const currntMonth = e
    setSelectMonth(e)
    setChartsMonth(e)
    fetch(
      `http://localhost:3000/api/transactions?month=${currntMonth}&page=${transactionData?.page}&perPage=${transactionData?.perPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTransactionData(data);
      });
  }

  const heandleSearch = (e) =>{
    const value = e.target.value
    setSearch(value)
    let url
    if(selectMonth !== ""){
      url = `http://localhost:3000/api/transactions?month=${selectMonth}&search=${value}&page=${transactionData?.page}&perPage=${transactionData?.perPage}`
    }
    else{
      url = `http://localhost:3000/api/transactions?search=${value}&page=${transactionData?.page}&perPage=${transactionData?.perPage}`
    }
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTransactionData(data);
        });
  }

  const priceRanges = chartsData?.bar_chart?.graphDetails?.map(detail => detail.price_range);
  const itemCounts = chartsData?.bar_chart?.graphDetails?.map(detail => detail.item_count);

  const barChartOptions = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Items Sold by Price Range'
    },
    xAxis: {
      categories: priceRanges,
      title: {
        text: 'Price Range'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Item Count'
      }
    },
    series: [{
      name: 'Item Count',
      data: itemCounts,
      color: '#7cb5ec'
    }]
  };

  const pieChartData = chartsData?.pie_chart?.piechartDetails?.map(detail => ({
    name: detail.category,
    y: detail.item_count
  }));

  // Data for the pie chart
  const pieChartOptions = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Sales Distribution'
    },
    series: [{
      name: 'Items',
      colorByPoint: true,
      data:pieChartData
    }]
  };

  return (
    <>
      <h1 className="heading">Transaction Details</h1>
      <div className="tableData">
        <div className="filters-container">
          <div className="select-container">
          <label>SelectMont</label>
        <Select
        onChange={(e)=>handleChange(e)}
        style={{width:"10rem"}}
          options={[
            { value:"",label:"All"},
            { value: "January", label: "January" },
            { value: "Febraury", label: "Febraury" },
            { value: "March", label: "March" },
            { value: "April", label: "April" },
            { value: "May", label: "May" },
            { value: "June", label: "June" },
            { value: "July", label: "July" },
            { value: "August", label: "August" },
            { value: "Septmber", label: "Septmber" },
            { value: "October", label: "October" },
            { value: "Novomber", label: "Novomber" },
            { value: "December", label: "December" },
          ]}
        />
        </div>
        <div className="select-container">
        <label>Search by</label>
        <Input placeholder="Enter title or discription" onChange={(e) => heandleSearch(e)} className="input-container"/>
        </div>
        </div>
        <Table
          columns={columns}
          dataSource={transactionData?.transactions}
          pagination={{
            total: transactionData?.total,
            defaultPageSize: transactionData?.perPage,
            onChange: (pageNo, pageSize) => {
              handlePagination(pageNo, pageSize);
            },
          }}
          // scroll={{
          //   y: 540,
          // }}
        />
      </div>
      <div>
      <div className="cards-container">
      <div className="cards">
        <p>totalSaleAmountPrice</p>
        <p>{chartsData?.statistics?.totalSaleAmount}</p>
      </div>
      <div className="cards">
        <p>totalNotSoldItems</p>
        <p>{chartsData?.statistics?.totalNotSoldItems}</p>
      </div>
      <div className="cards">
        <p>totalSoldItems</p>
        <p>{chartsData?.statistics?.totalSoldItems}</p>
      </div>
      </div>
      <h1 className="heading">Chart Details</h1>
      <div className="charts-container">
      <div className="chart">
        <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
      </div>
      <div className="chart">
        <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
      </div>
    </div>
    
    </div>
    </>
  );
};

export default Tables;
