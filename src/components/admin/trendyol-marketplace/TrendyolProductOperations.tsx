import React, { useState } from 'react';
import { TrendyolProductOperationResponse } from '@/constants/models/trendyol/ProductWithTrendyolResponse';
import TrendyolProductOperationDetail from './TrendyolProductOperationDetail';

interface TrendyolProductOperationsProps {
  operations: TrendyolProductOperationResponse[];
  statusOptions?: Array<{ value: number; displayName: string }>;
  operationTypes?: Array<{ value: number; displayName: string }>;
}

const TrendyolProductOperations: React.FC<TrendyolProductOperationsProps> = ({
  operations,
  statusOptions = [],
  operationTypes = []
}) => {
  const [selectedOperation, setSelectedOperation] = useState<TrendyolProductOperationResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleShowDetail = (operation: TrendyolProductOperationResponse) => {
    setSelectedOperation(operation);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedOperation(null);
  };
  // Helper functions for enum display
  const getStatusDisplayName = (statusValue: number) => {
    const statusOption = statusOptions?.find(option => option.value === statusValue);
    return statusOption?.displayName || `Durum ${statusValue}`;
  };

  const getOperationTypeDisplayName = (operationTypeValue: number) => {
    const operationType = operationTypes?.find(option => option.value === operationTypeValue);
    return operationType?.displayName || `İşlem ${operationTypeValue}`;
  };

  if (!operations || operations.length === 0) {
    return null;
  }

  return (
    <div className="row mb-4">
      <div className="col-12">
        <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
          <i className="bx bx-history me-2"></i>
          Son İşlemler
        </h6>

        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>İşlem Tipi</th>
                <th>Durum</th>
                <th>İstek Tarihi</th>
                <th>Yanıt Tarihi</th>
                <th>Final</th>
                <th>Detaylar</th>
              </tr>
            </thead>
            <tbody>
              {operations.slice(0, 5).map((operation, index) => (
                <tr 
                  key={operation.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowDetail(operation)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: operation.operationType === 1 ? '#856404' :
                        operation.operationType === 3 ? '#0c5460' : '#6c757d'
                    }}>
                      {getOperationTypeDisplayName(operation.operationType)}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: operation.status === 1 ? '#155724' :
                        operation.status === 5 ? '#721c24' :
                          operation.status === 8 ? '#856404' : '#6c757d'
                    }}>
                      {getStatusDisplayName(operation.status)}
                    </span>
                  </td>
                  <td>
                    <small style={{ fontSize: "0.8rem" }}>
                      {new Date(operation.requestedAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                  </td>
                  <td>
                    <small style={{ fontSize: "0.8rem" }}>
                      {operation.respondedAt ?
                        new Date(operation.respondedAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                    </small>
                  </td>
                  <td>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: operation.isFinal ? '#155724' : '#856404'
                    }}>
                      {operation.isFinal ? 'Evet' : 'Hayır'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetail(operation);
                      }}
                      title="Detayları Görüntüle"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <i className="bx bx-show me-1"></i>
                      Detaylar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        <TrendyolProductOperationDetail
          operation={selectedOperation}
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
          statusOptions={statusOptions}
          operationTypes={operationTypes}
        />
      </div>
    </div>
  );
};

export default TrendyolProductOperations; 