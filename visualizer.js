import React, { useState, useRef, useEffect } from 'react';
import { XCircle, Check, ChevronDown, ChevronUp, Plus, Trash2, Download } from 'lucide-react';

export default function PsychotherapyVisualizer() {
  // Основные категории
  const categories = {
    processes: [
      { id: 'attention', name: 'Процессы внимания', color: '#FF6B6B' },
      { id: 'cognitive', name: 'Когнитивные процессы', color: '#4ECDC4' },
      { id: 'affective', name: 'Аффективные процессы', color: '#FFD166' },
      { id: 'selfing', name: 'Процессы селфинга', color: '#6A0572' },
      { id: 'behavioral', name: 'Поведенческие процессы', color: '#1A535C' },
      { id: 'motivational', name: 'Мотивационные процессы', color: '#3D348B' }
    ],
    contexts: [
      { id: 'biophysiological', name: 'Биофизиологический контекст', color: '#F7B801' },
      { id: 'situational', name: 'Ситуативный контекст', color: '#F18701' },
      { id: 'personal_history', name: 'Личная история', color: '#F35B04' },
      { id: 'socio_cultural', name: 'Социо-культурный контекст', color: '#C81D25' },
      { id: 'therapeutic', name: 'Контекст терапевтических отношений', color: '#721817' }
    ]
  };

  // Начальное состояние
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeTab, setActiveTab] = useState('level1');
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [addingNode, setAddingNode] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeCategory, setNodeCategory] = useState('');
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionEnd, setConnectionEnd] = useState(null);
  const [connectionType, setConnectionType] = useState('');
  const [connectionStrength, setConnectionStrength] = useState(1);
  const [addingConnection, setAddingConnection] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [newPartName, setNewPartName] = useState('');
  const [newPartDescription, setNewPartDescription] = useState('');
  const [selectedProcesses, setSelectedProcesses] = useState({});
  const [nodeDataForExport, setNodeDataForExport] = useState('');
  const [showExportData, setShowExportData] = useState(false);

  // Пример данных для демонстрации
  const loadSampleData = () => {
    const sampleNodes = [
      {
        id: 'node-1',
        name: 'Зацикливание на негативных мыслях',
        description: 'Внимание постоянно возвращается к ощущению тяжести в груди',
        category: 'attention',
        color: '#FF6B6B',
        type: 'problem',
        x: 100,
        y: 150
      },
      {
        id: 'node-2',
        name: 'Катастрофизация',
        description: 'Мысли о полном провале презентации',
        category: 'cognitive',
        color: '#4ECDC4',
        type: 'problem',
        x: 300,
        y: 100
      },
      {
        id: 'node-3',
        name: 'Тревога',
        description: 'Интенсивное чувство тревоги при мыслях о выступлении',
        category: 'affective',
        color: '#FFD166',
        type: 'problem',
        x: 500,
        y: 150
      },
      {
        id: 'node-4',
        name: 'Низкая самоэффективность',
        description: 'Убеждение "Я не справлюсь"',
        category: 'selfing',
        color: '#6A0572',
        type: 'problem',
        x: 400,
        y: 250
      },
      {
        id: 'node-5',
        name: 'Избегание',
        description: 'Откладывание подготовки к презентации',
        category: 'behavioral',
        color: '#1A535C',
        type: 'problem',
        x: 200,
        y: 300
      }
    ];
    
    const sampleConnections = [
      {
        id: 'conn-1',
        source: 'node-2',
        target: 'node-3',
        type: 'activates',
        strength: 4
      },
      {
        id: 'conn-2',
        source: 'node-3',
        target: 'node-1',
        type: 'activates',
        strength: 3
      },
      {
        id: 'conn-3',
        source: 'node-4',
        target: 'node-5',
        type: 'activates',
        strength: 5
      },
      {
        id: 'conn-4',
        source: 'node-2',
        target: 'node-4',
        type: 'correlates',
        strength: 2
      }
    ];
    
    const sampleParts = [
      {
        id: 'part-1',
        name: 'Внутренний критик',
        description: 'Часть, которая постоянно критикует и указывает на недостатки',
        processes: ['cognitive', 'selfing']
      },
      {
        id: 'part-2',
        name: 'Избегающая часть',
        description: 'Часть, которая стремится избежать дискомфорта и стресса',
        processes: ['behavioral', 'affective']
      }
    ];
    
    const sampleProcesses = [
      {
        id: 'process-1',
        name: 'Руминирование',
        description: 'Паттерн зацикливания на негативных мыслях и эмоциях',
        components: ['attention', 'cognitive', 'affective']
      },
      {
        id: 'process-2',
        name: 'Избегание стресса',
        description: 'Комплексный паттерн, включающий когнитивные и поведенческие стратегии избегания',
        components: ['cognitive', 'behavioral', 'affective']
      }
    ];
    
    setNodes(sampleNodes);
    setConnections(sampleConnections);
    setPartsData(sampleParts);
    setProcesses(sampleProcesses);
  };

  // Функция для добавления нового узла
  const addNode = () => {
    if (nodeName && nodeCategory) {
      const categoryInfo = [...categories.processes, ...categories.contexts].find(c => c.id === nodeCategory);
      const newNode = {
        id: `node-${Date.now()}`,
        name: nodeName,
        description: nodeDescription,
        category: nodeCategory,
        color: categoryInfo ? categoryInfo.color : '#000000',
        type: selectedNodeType,
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
      };
      
      setNodes([...nodes, newNode]);
      setAddingNode(false);
      setNodeName('');
      setNodeDescription('');
      setNodeCategory('');
    }
  };

  // Функция для добавления новой связи
  const addConnection = () => {
    if (connectionStart && connectionEnd && connectionType) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        source: connectionStart,
        target: connectionEnd,
        type: connectionType,
        strength: connectionStrength
      };
      
      setConnections([...connections, newConnection]);
      setAddingConnection(false);
      setConnectionStart(null);
      setConnectionEnd(null);
      setConnectionType('');
      setConnectionStrength(1);
    }
  };

  // Функция для добавления новой части (уровень 2)
  const addPart = () => {
    if (newPartName) {
      const newPart = {
        id: `part-${Date.now()}`,
        name: newPartName,
        description: newPartDescription,
        processes: Object.keys(selectedProcesses).filter(key => selectedProcesses[key])
      };
      
      setPartsData([...partsData, newPart]);
      setNewPartName('');
      setNewPartDescription('');
      setSelectedProcesses({});
    }
  };

  // Функция для добавления нового интегративного процесса (уровень 3)
  const addProcess = () => {
    if (newPartName) {
      const newProcess = {
        id: `process-${Date.now()}`,
        name: newPartName,
        description: newPartDescription,
        components: Object.keys(selectedProcesses).filter(key => selectedProcesses[key])
      };
      
      setProcesses([...processes, newProcess]);
      setNewPartName('');
      setNewPartDescription('');
      setSelectedProcesses({});
    }
  };

  // Функция для удаления узла
  const removeNode = (id) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(conn => conn.source !== id && conn.target !== id));
  };

  // Функция для удаления связи
  const removeConnection = (id) => {
    setConnections(connections.filter(conn => conn.id !== id));
  };

  // Функция для удаления части
  const removePart = (id) => {
    setPartsData(partsData.filter(part => part.id !== id));
  };

  // Функция для удаления процесса
  const removeProcess = (id) => {
    setProcesses(processes.filter(process => process.id !== id));
  };

  // Функция для экспорта данных
  const exportData = () => {
    const data = {
      level1: {
        nodes,
        connections
      },
      level2: {
        parts: partsData
      },
      level3: {
        processes
      }
    };
    
    setNodeDataForExport(JSON.stringify(data, null, 2));
    setShowExportData(true);
  };

  // Компонент для рендеринга связей (линий) между узлами
  const ConnectionLines = () => {
    // Находим соответствующие узлы для каждой связи
    const connectionLines = connections.map(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return null;
      
      // Определяем стиль линии в зависимости от типа и силы связи
      let strokeStyle = '#999';
      let strokeWidth = conn.strength;
      let strokeDasharray = '';
      
      switch(conn.type) {
        case 'activates':
          strokeStyle = '#4CAF50';
          break;
        case 'inhibits':
          strokeStyle = '#F44336';
          strokeDasharray = '5,5';
          break;
        case 'correlates':
          strokeStyle = '#2196F3';
          strokeDasharray = '1,1';
          break;
        case 'follows':
          strokeStyle = '#9C27B0';
          break;
      }
      
      return (
        <g key={conn.id}>
          <line
            x1={sourceNode.x}
            y1={sourceNode.y}
            x2={targetNode.x}
            y2={targetNode.y}
            stroke={strokeStyle}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
          {/* Стрелка для направления */}
          <polygon
            points={`0,-5 10,0 0,5`}
            fill={strokeStyle}
            transform={`translate(${(targetNode.x + sourceNode.x) / 2}, ${(targetNode.y + sourceNode.y) / 2}) 
                       rotate(${Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x) * 180 / Math.PI})`}
          />
          {/* Метка с типом связи */}
          <text
            x={(sourceNode.x + targetNode.x) / 2}
            y={(sourceNode.y + targetNode.y) / 2 - 10}
            textAnchor="middle"
            fill="#333"
            fontSize="12"
          >
            {conn.type} ({conn.strength})
          </text>
        </g>
      );
    });
    
    return <>{connectionLines}</>;
  };

  // Компонент для отображения графа
  const Graph = () => {
    const svgRef = useRef(null);
    const [dragging, setDragging] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    
    const startDrag = (e, id) => {
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      
      const node = nodes.find(n => n.id === id);
      if (node) {
        setDragging(id);
        setOffset({
          x: svgP.x - node.x,
          y: svgP.y - node.y
        });
      }
    };
    
    const onDrag = (e) => {
      if (dragging) {
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        
        const updatedNodes = nodes.map(node => {
          if (node.id === dragging) {
            return {
              ...node,
              x: svgP.x - offset.x,
              y: svgP.y - offset.y
            };
          }
          return node;
        });
        
        setNodes(updatedNodes);
      }
    };
    
    const endDrag = () => {
      setDragging(null);
    };
    
    return (
      <div className="border rounded p-2 bg-white h-96 overflow-auto">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          onMouseMove={onDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
        >
          <ConnectionLines />
          
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill={node.color}
                stroke={node.type === 'problem' ? '#000' : '#4CAF50'}
                strokeWidth={2}
                onMouseDown={(e) => startDrag(e, node.id)}
                style={{ cursor: 'move' }}
              />
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                fill="#333"
                fontSize="12"
              >
                {node.name.length > 20 ? node.name.substring(0, 17) + '...' : node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  useEffect(() => {
    // При первой загрузке показываем пример данных
    if (nodes.length === 0 && connections.length === 0) {
      loadSampleData();
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Визуализатор психотерапевтического анализа</h1>
      
      {/* Вкладки для уровней */}
      <div className="flex mb-4 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'level1' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t-lg mr-1`}
          onClick={() => setActiveTab('level1')}
        >
          Уровень 1: Базовые категории
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'level2' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t-lg mr-1`}
          onClick={() => setActiveTab('level2')}
        >
          Уровень 2: Части и субличности
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'level3' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t-lg`}
          onClick={() => setActiveTab('level3')}
        >
          Уровень 3: Интегративные процессы
        </button>
      </div>
      
      {/* Уровень 1: Базовые категории */}
      {activeTab === 'level1' && (
        <div className="flex flex-col">
          {!addingNode && !addingConnection && (
            <div className="flex space-x-2 mb-4">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => {
                  setSelectedNodeType('problem');
                  setAddingNode(true);
                }}
              >
                <Plus className="mr-1" size={16} />
                Добавить проблемный процесс
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => {
                  setSelectedNodeType('resource');
                  setAddingNode(true);
                }}
              >
                <Plus className="mr-1" size={16} />
                Добавить ресурсный процесс
              </button>
              <button 
                className="bg-purple-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => setAddingConnection(true)}
              >
                <Plus className="mr-1" size={16} />
                Добавить связь
              </button>
            </div>
          )}
          
          {/* Форма добавления узла */}
          {addingNode && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {selectedNodeType === 'problem' ? 'Добавить проблемный процесс' : 'Добавить ресурсный процесс'}
              </h3>
              <div className="mb-2">
                <label className="block mb-1">Название:</label>
                <input 
                  type="text" 
                  value={nodeName} 
                  onChange={(e) => setNodeName(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Описание:</label>
                <textarea 
                  value={nodeDescription} 
                  onChange={(e) => setNodeDescription(e.target.value)}
                  className="w-full border rounded p-2"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Категория:</label>
                <select 
                  value={nodeCategory}
                  onChange={(e) => setNodeCategory(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Выберите категорию</option>
                  <optgroup label="Психологические сферы">
                    {categories.processes.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Контексты">
                    {categories.contexts.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => setAddingNode(false)}
                >
                  Отмена
                </button>
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={addNode}
                >
                  Добавить
                </button>
              </div>
            </div>
          )}
          
          {/* Форма добавления связи */}
          {addingConnection && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-lg font-semibold mb-2">Добавить связь</h3>
              <div className="mb-2">
                <label className="block mb-1">От узла:</label>
                <select 
                  value={connectionStart || ''}
                  onChange={(e) => setConnectionStart(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Выберите начальный узел</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">К узлу:</label>
                <select 
                  value={connectionEnd || ''}
                  onChange={(e) => setConnectionEnd(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Выберите конечный узел</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Тип связи:</label>
                <select 
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Выберите тип связи</option>
                  <option value="activates">Активирует</option>
                  <option value="inhibits">Подавляет</option>
                  <option value="correlates">Коррелирует</option>
                  <option value="follows">Следует за</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Сила связи (1-5):</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={connectionStrength} 
                  onChange={(e) => setConnectionStrength(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center">{connectionStrength}</div>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => setAddingConnection(false)}
                >
                  Отмена
                </button>
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={addConnection}
                >
                  Добавить
                </button>
              </div>
            </div>
          )}
          
          {/* Визуализация графа */}
          <Graph />
          
          {/* Список узлов и связей */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Узлы</h3>
              <div className="bg-white rounded border p-2 max-h-64 overflow-y-auto">
                {nodes.length === 0 ? (
                  <p className="text-gray-500">Нет добавленных узлов</p>
                ) : (
                  <ul>
                    {nodes.map(node => (
                      <li key={node.id} className="mb-2 p-2 border-b flex justify-between items-center">
                        <div>
                          <span 
                            className="inline-block w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: node.color }}
                          ></span>
                          <strong>{node.name}</strong> 
                          <span className="text-xs">
                            ({[...categories.processes, ...categories.contexts].find(c => c.id === node.category)?.name})
                          </span>
                        </div>
                        <button 
                          onClick={() => removeNode(node.id)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Связи</h3>
              <div className="bg-white rounded border p-2 max-h-64 overflow-y-auto">
                {connections.length === 0 ? (
                  <p className="text-gray-500">Нет добавленных связей</p>
                ) : (
                  <ul>
                    {connections.map(conn => {
                      const sourceNode = nodes.find(n => n.id === conn.source);
                      const targetNode = nodes.find(n => n.id === conn.target);
                      
                      return (
                        <li key={conn.id} className="mb-2 p-2 border-b flex justify-between items-center">
                          <div>
                            <strong>{sourceNode?.name}</strong> 
                            <span className="mx-2">→</span>
                            <strong>{targetNode?.name}</strong>
                            <span className="ml-2 text-xs">
                              ({conn.type}, сила: {conn.strength})
                            </span>
                          </div>
                          <button 
                            onClick={() => removeConnection(conn.id)}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Уровень 2: Части и субличности */}
      {activeTab === 'level2' && (
        <div className="flex flex-col">
          <div className="mb-4">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() => {
                setSelectedPart(null);
                setNewPartName('');
                setNewPartDescription('');
                setSelectedProcesses({});
              }}
            >
              <Plus className="mr-1" size={16} />
              Добавить часть/субличность
            </button>
          </div>
          
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {selectedPart ? `Редактировать часть: ${selectedPart.name}` : 'Новая часть/субличность'}
            </h3>
            <div className="mb-2">
              <label className="block mb-1">Название:</label>
              <input 
                type="text" 
                value={newPartName} 
                onChange={(e) => setNewPartName(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Например: Внутренний критик"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Описание:</label>
              <textarea 
                value={newPartDescription} 
                onChange={(e) => setNewPartDescription(e.target.value)}
                className="w-full border rounded p-2"
                rows="3"
                placeholder="Опишите характеристики и функции этой части..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Связанные базовые процессы:</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.processes.map(proc => (
                  <div key={proc.id} className="flex items-center">
                    <input 
                      type="checkbox"
                      id={`proc-${proc.id}`}
                      checked={selectedProcesses[proc.id] || false}
                      onChange={(e) => setSelectedProcesses({
                        ...selectedProcesses,
                        [proc.id]: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <label htmlFor={`proc-${proc.id}`} className="text-sm">
                      {proc.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => {
                  setNewPartName('');
                  setNewPartDescription('');
                  setSelectedProcesses({});
                  setSelectedPart(null);
                }}
              >
                Отмена
              </button>
              <button 
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={addPart}
                disabled={!newPartName}
              >
                Добавить
              </button>
            </div>
          </div>
          
          {/* Список частей */}
          <div className="bg-white rounded border p-2">
            <h3 className="text-lg font-semibold mb-2">Части и субличности</h3>
            {partsData.length === 0 ? (
              <p className="text-gray-500">Нет добавленных частей</p>
            ) : (
              <ul>
                {partsData.map(part => (
                  <li key={part.id} className="mb-4 p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">{part.name}</h4>
                      <button 
                        onClick={() => removePart(part.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm mb-2">{part.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {part.processes.map(procId => {
                        const proc = categories.processes.find(p => p.id === procId);
                        return proc ? (
                          <span 
                            key={procId} 
                            className="text-xs px-2 py-1 rounded" 
                            style={{ backgroundColor: proc.color, color: '#fff' }}
                          >
                            {proc.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {/* Уровень 3: Интегративные процессы */}
      {activeTab === 'level3' && (
        <div className="flex flex-col">
          <div className="mb-4">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() => {
                setNewPartName('');
                setNewPartDescription('');
                setSelectedProcesses({});
              }}
            >
              <Plus className="mr-1" size={16} />
              Добавить интегративный процесс
            </button>
          </div>
          
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-lg font-semibold mb-2">Новый интегративный процесс</h3>
            <div className="mb-2">
              <label className="block mb-1">Название:</label>
              <input 
                type="text" 
                value={newPartName} 
                onChange={(e) => setNewPartName(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Например: Руминирование"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Описание:</label>
              <textarea 
                value={newPartDescription} 
                onChange={(e) => setNewPartDescription(e.target.value)}
                className="w-full border rounded p-2"
                rows="3"
                placeholder="Опишите паттерн и его проявления..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Компоненты из базового уровня:</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.processes.map(proc => (
                  <div key={proc.id} className="flex items-center">
                    <input 
                      type="checkbox"
                      id={`process-${proc.id}`}
                      checked={selectedProcesses[proc.id] || false}
                      onChange={(e) => setSelectedProcesses({
                        ...selectedProcesses,
                        [proc.id]: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <label htmlFor={`process-${proc.id}`} className="text-sm">
                      {proc.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => {
                  setNewPartName('');
                  setNewPartDescription('');
                  setSelectedProcesses({});
                }}
              >
                Отмена
              </button>
              <button 
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={addProcess}
                disabled={!newPartName}
              >
                Добавить
              </button>
            </div>
          </div>
          
          {/* Список интегративных процессов */}
          <div className="bg-white rounded border p-2">
            <h3 className="text-lg font-semibold mb-2">Интегративные процессы</h3>
            {processes.length === 0 ? (
              <p className="text-gray-500">Нет добавленных процессов</p>
            ) : (
              <ul>
                {processes.map(process => (
                  <li key={process.id} className="mb-4 p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">{process.name}</h4>
                      <button 
                        onClick={() => removeProcess(process.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm mb-2">{process.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {process.components.map(compId => {
                        const comp = categories.processes.find(p => p.id === compId);
                        return comp ? (
                          <span 
                            key={compId} 
                            className="text-xs px-2 py-1 rounded" 
                            style={{ backgroundColor: comp.color, color: '#fff' }}
                          >
                            {comp.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {/* Кнопки экспорта и загрузки примера */}
      <div className="mt-4 flex justify-between">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={loadSampleData}
        >
          Загрузить пример данных
        </button>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          onClick={exportData}
        >
          <Download className="mr-1" size={16} />
          Экспортировать данные
        </button>
      </div>
      
      {/* Отображение экспортированных данных */}
      {showExportData && (
        <div className="mt-4 bg-white p-4 rounded border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Данные для экспорта</h3>
            <button 
              className="text-gray-500"
              onClick={() => setShowExportData(false)}
            >
              <XCircle size={20} />
            </button>
          </div>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto h-64">
            {nodeDataForExport}
          </pre>
        </div>
      )}
    </div>
  );
}
