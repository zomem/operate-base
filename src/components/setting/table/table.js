import React, { useState, useEffect } from 'react'
import { Table, Badge } from 'antd'
import { isEqual, sortBy, uniqBy, uniq, pull, pullAllBy } from 'lodash'

import './table.css'
import '../../../App.css'

const minapp = require('minapp-fetch').init('op')



function TableList(){
  const [tableList, setTableList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(()=>{
    if(tableList.length === 0){
      getTable()
    }
  })

  //检查长度是否匹配，不匹配变成匹配
  function checkIsSame(f1, f2){
    f1 = pullAllBy(f1, [{name: '-'}], 'name')
    f2 = pullAllBy(f2, [{name: '-'}], 'name')
    let F = uniqBy(sortBy(f1.concat(f2), function(oo){ return oo.name }), function(o){return o.name})     //合并数组,去重
    let addIndex1 = []
    let addIndex2 = []

    for(let i = 0; i < F.length; i++){
      for(let j = 0; j < f1.length; j++){
        if(F[i].name === f1[j].name){
          pull(addIndex1, i)
          break
        }
        addIndex1.push(i)
      }
    }
    for(let i = 0; i < F.length; i++){
      for(let j = 0; j < f2.length; j++){
        if(F[i].name === f2[j].name){
          pull(addIndex2, i)
          break
        }
        addIndex2.push(i)
      }
    }
    addIndex1 = uniq(addIndex1)
    addIndex2 = uniq(addIndex2)
    console.log('Adindex', addIndex1, addIndex2)
    for(let i = 0; i < addIndex1.length; i++){
      f1.splice(addIndex1[i], 0, { name: '-' })
    }
    for(let i = 0; i < addIndex2.length; i++){
      f2.splice(addIndex2[i], 0, { name: '-' })
    }

    return {f1, f2}
  }

  //对schema下面的fields进行处理,更改描述、collection_name、schema_id
  function changeFields(fields){
    let new_fields = []
    for(let i = 0; i < fields.length; i++){
      let o = fields[i]
      o.disabled = false    //有些返回的，有些没有
      if(o.collection_name){
        o.collection_name = o.collection_name.replace(o.schema_id, '').replace(/_dev|dev_/, '')
      }
      if(o.schema_id){
        o.schema_id = 1
      }
      if(o.description){
        o.description = ''
      }
      new_fields.push(o)
    }
    return sortBy(new_fields, function(oo) { return oo.name })
  }
  
  
  //查寻表
  function getTable(){
    let tempT = []
    minapp.getTableList({
      limit: 500
    }).then(res=>{
      tempT = res.data.objects
      console.log('tempTtempTtempTtempT...', tempT)
      let list = [], on_list = [], dev_list = []
      for(let i = 0; i < tempT.length; i++){
        if(/dev_|_dev/.test(tempT[i].name)){
          console.log('ooooo', tempT[i].options)
          let option_i = tempT[i].options || {}
          dev_list.push({
            id: tempT[i].id,
            table_name: '-',
            table_id: '-',
            dev_table_name: tempT[i].name,
            dev_table_id: tempT[i].id,
            table_des: option_i.description ? option_i.description : '',
            equalList: {
              default_row_perm: tempT[i].default_row_perm,
              write_perm: tempT[i].write_perm,
              fields: changeFields(tempT[i].schema.fields),
              protected_fields: tempT[i].protected_fields,
            },
            schema: tempT[i].schema,
            is_all_equal: 2,
          })
        }else{
          console.log('ooooo', tempT[i].options)
          let option_i = tempT[i].options || {}
          on_list.push({
            id: tempT[i].id,
            table_name: tempT[i].name,
            table_id: tempT[i].id,
            dev_table_name: '-',
            dev_table_id: '-',
            table_des: option_i.description ? option_i.description : '',
            equalList: {
              default_row_perm: tempT[i].default_row_perm,
              write_perm: tempT[i].write_perm,
              fields: changeFields(tempT[i].schema.fields),
              protected_fields: tempT[i].protected_fields,
            },
            schema: tempT[i].schema,
            is_all_equal: 2,
          })
        }
      }
      console.log('on_list,,dev_list...', on_list, dev_list)
      //将on_list 和 dev_list 合成一个表
      let last_dev_list = dev_list
      for(let i = 0; i < on_list.length; i++){
        let o = {}
        //默认为没有开发表的赋值
        o = on_list[i]
        o.fields = sortBy(on_list[i].schema.fields, function(oo) { return oo.name })
        //将开发表和正式表,合成,
        for(let j = 0; j < dev_list.length; j++){
          let pat = dev_list[j].dev_table_name.replace(on_list[i].table_name, '')
          if(pat === '_dev' || pat === 'dev_'){
            o = {
              id: on_list[i].table_id,
              table_name: on_list[i].table_name,
              table_id: on_list[i].table_id,
              dev_table_name: dev_list[j].dev_table_name,
              dev_table_id: dev_list[j].dev_table_id,
              table_des: dev_list[j].table_des || on_list[i].table_des || '',
              is_all_equal: isEqual(on_list[i].equalList, dev_list[j].equalList) ? 1 : 0,
              fields: sortBy(on_list[i].schema.fields, function(oo) { return oo.name }),
              dev_fields: sortBy(dev_list[j].schema.fields, function(oo) { return oo.name }),
            }
            last_dev_list.splice(j, 1)
            break
          }
        }
        list.push(o)
      }
      //对只有开发表，没有正式表的进行附加
      for(let n = 0; n < last_dev_list.length; n++){
        let lo = {}
        lo = last_dev_list[n]
        lo.dev_fields = sortBy(last_dev_list[n].schema.fields, function(oo) { return oo.name })
        list.push(lo)
      }
      console.log('last', last_dev_list)
      list.concat(last_dev_list)
      list = sortBy(list, function(o) { return o.table_name})
      for(let n = 0; n < list.length; n++){
        list[n].table_num = n + 1
      }
      console.log('listttttt', list)
      setTableList(list)
      setIsLoading(false)
    },err=>{
      setIsLoading(false)
    })
  }
  
  
  const expandedRowRender = (item) => {
    console.log('itemmmm',item)
    let { fields, dev_fields } = item
    let list = []
    if(!dev_fields){
      //只有正式表，没有对应的开发表
      for(let i = 0; i < fields.length; i++){
        let isP = ''
        if(fields[i].schema_id){
          isP = '是'
        }else{
          isP = ''
        }
        list.push({
          id: fields[i].name,
          name: fields[i].name,
          dev_name: '',
          isPointer: isP,
          fields_des: fields[i].description || '',
          isFieldEqual: 2,
        })
      }
    }else if(!fields){
      //只有开发表，没有对应的正式表
      for(let i = 0; i < dev_fields.length; i++){
        let isP = ''
        if(dev_fields[i].schema_id){
          isP = '是'
        }else{
          isP = ''
        }
        list.push({
          id: dev_fields[i].name,
          name: '',
          dev_name: dev_fields[i].name,
          isPointer: isP,
          fields_des: dev_fields[i].description || '',
          isFieldEqual: 2,
        })
      }
    }else{
      //检查长度是否匹配，如果不匹配，则在相应位置，加{name: undefined}
      let check = checkIsSame(fields, dev_fields)
      fields = check.f1
      dev_fields = check.f2

      for(let i = 0; i < fields.length; i++){
        let isP = ''
        if(fields[i].schema_id === 1 && dev_fields[i].schema_id === 1){
          isP = '是'
        }else if(fields[i].schema_id === 1 || dev_fields[i].schema_id === 1){
          isP = '只有一个是'
        }else{
          isP = ''
        }
        list.push({
          id: fields[i].name || dev_fields[i].name,
          name: fields[i].name || '-',
          dev_name: dev_fields[i].name || '-',
          isPointer: isP,
          fields_des: dev_fields[i].description || fields[i].description || '',
          isFieldEqual: isEqual(changeFields([fields[i]]), changeFields([dev_fields[i]])) ? 1 : 0,
        })
      }
    }
    
    const columns = [
      { title: '正式字段', dataIndex: 'name', key: 'name' },
      { title: '开发字段', dataIndex: 'dev_name', key: 'dev_name' },
      { title: '是否为pointer', dataIndex: 'isPointer', key: 'isPointer' },
      { title: '字段说明', dataIndex: 'fields_des', key: 'fields_des' },
      {
        title: '匹配状态',
        key: 'state',
        render: (item2) => (
          <span>
          <Badge status={ item2.isFieldEqual === 1 ? 'success' : item2.isFieldEqual === 2 ? 'default' : 'error' }  />
          { item2.isFieldEqual === 1 ? '成功' : item2.isFieldEqual === 2 ? '无' : '失败' }
          </span>
        ),
      }
    ]
    return <Table rowKey={ record => record.id } className='sub-table' columns={columns} dataSource={list} pagination={false} />
  }

  const columns = [
    { title: '数量', dataIndex: 'table_num', key: 'table_num' },
    { title: '正式表', dataIndex: 'table_name', key: 'table_name' },
    { title: '开发表', dataIndex: 'dev_table_name', key: 'dev_table_name' },
    { 
      title: '匹配状态', 
      key: 'is_equal', 
      render: (item) => (
        <span>
          <Badge status={ item.is_all_equal === 2 ? 'default' : item.is_all_equal === 1 ? 'success' : 'error' }  />
          { item.is_all_equal === 2 ? '无' : item.is_all_equal === 1 ? '成功' : '失败' }
        </span>
      ) 
    },
    { title: '表说明', dataIndex: 'table_des', key: 'table_des' }
  ]

  return(
    <Table
      rowKey={ record => record.id }
      className="components-table-demo-nested table"
      columns={columns}
      expandedRowRender={expandedRowRender}
      dataSource={tableList}
      pagination={false}
      loading={isLoading}
      bordered
    />
  )
}

export default TableList