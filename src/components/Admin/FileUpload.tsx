import React, { useState } from 'react';
import { Upload, message, Modal, Radio, Checkbox, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { createImportTask } from '../../services/importService';

interface FileUploadProps {
  onUploadSuccess: (taskId: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [deduplicate, setDeduplicate] = useState(true);
  const [autoTrigger, setAutoTrigger] = useState(true);
  const [uploading, setUploading] = useState(false);

  const beforeUpload = (file: File) => {
    // 验证文件格式
    const validFormats = ['.csv', '.xlsx', '.xls', '.xlsm'];
    const isValid = validFormats.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isValid) {
      message.error('仅支持 CSV 和 Excel 格式文件');
      return Upload.LIST_IGNORE;
    }

    // 验证文件大小 (100MB)
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('文件大小不能超过 100MB');
      return Upload.LIST_IGNORE;
    }

    // 显示确认对话框
    Modal.confirm({
      title: '确认上传',
      content: (
        <div>
          <p>文件名: {file.name}</p>
          <p>文件大小: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>导入模式: {mode === 'append' ? '增量导入' : '全量替换'}</p>
          <p>去重: {deduplicate ? '是' : '否'}</p>
          <p>自动触发分析: {autoTrigger ? '是' : '否'}</p>
        </div>
      ),
      onOk: async () => {
        setUploading(true);
        try {
          const result = await createImportTask(file, mode, deduplicate, autoTrigger);
          message.success('文件上传成功，导入任务已创建');
          onUploadSuccess(result.task_id);
        } catch (error: any) {
          message.error(`上传失败: ${error.message || '未知错误'}`);
        } finally {
          setUploading(false);
        }
      }
    });

    return false; // 阻止自动上传
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload,
    showUploadList: false,
    disabled: uploading
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导入模式
            </label>
            <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
              <Radio value="append">增量导入（追加新数据）</Radio>
              <Radio value="replace">全量替换（清空后导入）</Radio>
            </Radio.Group>
          </div>

          <div>
            <Checkbox checked={deduplicate} onChange={(e) => setDeduplicate(e.target.checked)}>
              启用去重（根据时间戳和坐标去重）
            </Checkbox>
          </div>

          <div>
            <Checkbox checked={autoTrigger} onChange={(e) => setAutoTrigger(e.target.checked)}>
              自动触发分析流水线（地理编码 + 轨迹分析）
            </Checkbox>
          </div>
        </Space>
      </div>

      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持 CSV 和 Excel 格式（.csv, .xlsx, .xls, .xlsm），文件大小不超过 100MB
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default FileUpload;
