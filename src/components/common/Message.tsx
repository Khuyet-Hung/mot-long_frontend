import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, AlertCircle, Info } from 'lucide-react';

interface MessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Message: React.FC<MessageProps> = ({ 
  type, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && onClose) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, (duration - elapsed) / duration * 100);
        setProgress(remaining);
        
        if (remaining <= 0) {
          clearInterval(timer);
          setIsVisible(false);
          setTimeout(onClose, 200); // Wait for fade out animation
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [autoClose, onClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 200);
  };

  // Enhanced design configs
  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
      borderColor: "border-emerald-400",
      textColor: "text-emerald-800",
      iconColor: "text-emerald-500",
      progressColor: "bg-emerald-500",
      shadow: "shadow-emerald-100"
    },
    error: {
      icon: XCircle,
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      borderColor: "border-red-400",
      textColor: "text-red-800",
      iconColor: "text-red-500",
      progressColor: "bg-red-500",
      shadow: "shadow-red-100"
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
      borderColor: "border-amber-400",
      textColor: "text-amber-800",
      iconColor: "text-amber-500",
      progressColor: "bg-amber-500",
      shadow: "shadow-amber-100"
    },
    info: {
      icon: Info,
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
      progressColor: "bg-blue-500",
      shadow: "shadow-blue-100"
    }
  };

  const config = configs[type];
  const IconComponent = config.icon;

  return (
    <div className={`
      relative flex items-start p-4 rounded-xl border-l-4 backdrop-blur-sm
      transition-all duration-300 ease-out transform
      ${config.bgColor} ${config.borderColor} ${config.shadow}
      min-w-[320px] max-w-md
      ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      shadow-lg hover:shadow-xl
    `}>
      {/* Icon */}
      <div className={`flex-shrink-0 mr-3 mt-0.5 ${config.iconColor}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 pr-2">
        <p className={`text-sm font-medium leading-relaxed ${config.textColor}`}>
          {message}
        </p>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 p-1.5 rounded-full transition-all duration-200
            ${config.iconColor} opacity-60 hover:opacity-100
            hover:bg-black/5 active:bg-black/10
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
          `}
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Progress Bar */}
      {autoClose && onClose && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-xl overflow-hidden">
          <div 
            className={`h-full ${config.progressColor} transition-all duration-75 ease-linear rounded-b-xl`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-20 pointer-events-none
        bg-gradient-to-r ${type === 'success' ? 'from-emerald-200/30 to-green-200/30' :
                          type === 'error' ? 'from-red-200/30 to-rose-200/30' :
                          type === 'warning' ? 'from-amber-200/30 to-yellow-200/30' :
                          'from-blue-200/30 to-cyan-200/30'}
      `} />
    </div>
  );
};

export default Message;