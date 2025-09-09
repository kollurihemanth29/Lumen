import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message based on role
    const welcomeMessage = getWelcomeMessage(user?.role);
    setMessages([{
      id: 1,
      text: welcomeMessage,
      sender: 'ai',
      timestamp: new Date()
    }]);
  }, [user]);

  const getWelcomeMessage = (role) => {
    switch (role) {
      case 'admin':
        return "👋 Hi! I'm your AI assistant. I can help you manage users, view system analytics, and handle administrative tasks. What would you like to do?";
      case 'manager':
        return "👋 Hello! I can help you manage products, suppliers, stock transactions, and team oversight. How can I assist you today?";
      case 'staff':
        return "👋 Hi there! I can guide you through stock operations, product lookups, and daily tasks. What do you need help with?";
      default:
        return "👋 Welcome to Lumen Quest! I'm here to help you navigate the system.";
    }
  };

  const getRolePermissions = (role) => {
    switch (role) {
      case 'admin':
        return ['manage_users', 'view_all', 'create_users', 'system_settings'];
      case 'manager':
        return ['manage_products', 'manage_suppliers', 'stock_transactions', 'view_reports'];
      case 'staff':
        return ['view_products', 'stock_in', 'stock_out', 'view_stock'];
      default:
        return [];
    }
  };

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const permissions = getRolePermissions(user?.role);

    // Common help patterns
    if (input.includes('help') || input.includes('what can you do')) {
      return getHelpResponse(user?.role, permissions);
    }

    // User management (Admin only)
    if (input.includes('user') || input.includes('create user') || input.includes('add user')) {
      if (permissions.includes('manage_users')) {
        return "✅ **Create User Steps:**\n1. Click 'Users' in navbar\n2. Click '+ Add User' button\n3. Fill: Name, Email, Role, Department\n4. Click 'Save'\n\n*Admin privilege required*";
      } else {
        return "⚠️ User management requires Admin access. Contact your administrator to create new users.";
      }
    }

    // Product management
    if (input.includes('product') || input.includes('inventory')) {
      if (permissions.includes('manage_products')) {
        return "✅ **Product Management:**\n1. Navigate to Products section\n2. Add/Edit: Name, Category, SKU, Price\n3. Set reorder points\n4. Track stock levels\n\n*Manager/Admin access*";
      } else if (permissions.includes('view_products')) {
        return "✅ **View Products:**\n1. Go to Products tab\n2. Search by name/SKU\n3. View stock levels\n4. Check product details\n\n*Read-only access*";
      } else {
        return "⚠️ Product access restricted. Contact your manager for product information.";
      }
    }

    // Stock operations
    if (input.includes('stock') || input.includes('inventory')) {
      if (permissions.includes('stock_transactions')) {
        return "✅ **Stock Operations:**\n1. **Stock In:** Products → Stock In → Enter quantity\n2. **Stock Out:** Products → Stock Out → Select reason\n3. **View Levels:** Dashboard → Stock Overview\n\n*Manager/Staff access*";
      } else {
        return "⚠️ Stock operations require Staff level access or higher.";
      }
    }

    // Supplier management
    if (input.includes('supplier') || input.includes('vendor')) {
      if (permissions.includes('manage_suppliers')) {
        return "✅ **Supplier Management:**\n1. Go to Suppliers section\n2. Add: Company details, GST/PAN\n3. Set payment terms\n4. Track performance ratings\n\n*Manager/Admin access*";
      } else {
        return "⚠️ Supplier management requires Manager access or higher.";
      }
    }

    // Reports
    if (input.includes('report') || input.includes('analytics')) {
      if (permissions.includes('view_reports') || permissions.includes('view_all')) {
        return "✅ **Reports Available:**\n1. Stock levels & alerts\n2. Transaction history\n3. Supplier performance\n4. Department analytics\n\n*Manager/Admin access*";
      } else {
        return "⚠️ Report access requires Manager level or higher. Contact your supervisor.";
      }
    }

    // Default response
    return `I can help with tasks related to your ${user?.role} role. Try asking about:\n• "What can you do?"\n• "How to manage products"\n• "Stock operations"\n• "User management" (Admin)\n\nWhat specific task do you need help with?`;
  };

  const getHelpResponse = (role, permissions) => {
    const baseHelp = "🤖 **I can help you with:**\n";
    let roleSpecific = "";

    switch (role) {
      case 'admin':
        roleSpecific = "• User management & creation\n• System settings & security\n• All product & supplier operations\n• Complete system analytics\n• Department oversight";
        break;
      case 'manager':
        roleSpecific = "• Product & supplier management\n• Stock transaction oversight\n• Team performance reports\n• Approval workflows\n• Department analytics";
        break;
      case 'staff':
        roleSpecific = "• Product lookups & search\n• Stock in/out operations\n• Daily task guidance\n• Basic reporting\n• Personal performance";
        break;
      default:
        roleSpecific = "• General navigation help\n• Role-appropriate guidance";
    }

    return baseHelp + roleSpecific + "\n\n*Ask me anything specific!*";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateResponse(input),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'manager': return 'warning';
      case 'staff': return 'info';
      default: return 'primary';
    }
  };

  return (
    <>
      {/* Floating Bot Icon */}
      <div 
        className={`floating-bot-icon ${isOpen ? 'd-none' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <div className={`bot-icon bg-${getRoleColor(user?.role)}`}>
          <i className="bi bi-robot text-white"></i>
        </div>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="floating-chat-container">
          <div className="card border-0 shadow-lg">
            <div className={`card-header bg-${getRoleColor(user?.role)} text-white py-3 d-flex justify-content-between align-items-center`}>
              <div>
                <h6 className="mb-0">
                  <i className="bi bi-robot me-2"></i>
                  AI Assistant
                  <span className="badge bg-light text-dark ms-2 small">
                    {user?.role?.toUpperCase()}
                  </span>
                </h6>
              </div>
              <button 
                className="btn btn-sm text-white p-0"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none' }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="card-body p-0">
              {/* Messages */}
              <div className="chat-messages p-3" style={{ height: '350px', overflowY: 'auto' }}>
                {messages.map((message) => (
                  <div key={message.id} className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`max-w-75 ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`p-2 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                        <div style={{ whiteSpace: 'pre-line', fontSize: '0.85rem' }}>
                          {message.text}
                        </div>
                        <small className={`d-block mt-1 ${message.sender === 'user' ? 'text-white-50' : 'text-muted'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 ${message.sender === 'user' ? 'order-2 ms-2' : 'order-1 me-2'}`}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{width: '28px', height: '28px'}}>
                        <i className={`bi ${message.sender === 'user' ? 'bi-person-fill' : 'bi-robot'}`} style={{fontSize: '0.8rem'}}></i>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="d-flex justify-content-start mb-3">
                    <div className="flex-shrink-0 me-2">
                      <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{width: '28px', height: '28px'}}>
                        <i className="bi bi-robot" style={{fontSize: '0.8rem'}}></i>
                      </div>
                    </div>
                    <div className="bg-light p-2 rounded">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-top p-3">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className={`btn btn-${getRoleColor(user?.role)}`}
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                  >
                    <i className="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
