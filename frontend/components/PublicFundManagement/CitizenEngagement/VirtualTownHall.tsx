'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Users,
  Hand,
  MessageSquare,
  Settings,
  VolumeX,
  Volume2,
  Maximize,
  Minimize,
  PhoneOff,
  ScreenShare,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Download,
  Clock,
  Calendar,
  MapPin,
  Eye,
  Zap,
  Globe,
  Headphones
} from 'lucide-react';

interface VirtualTownHallProps {
  eventId: number;
  eventTitle: string;
  proposalId?: number;
  showNotification: (message: string) => void;
  onError: (error: string) => void;
}

interface Participant {
  id: string;
  name: string;
  role: 'moderator' | 'speaker' | 'participant';
  isVideoOn: boolean;
  isAudioOn: boolean;
  hasHandRaised: boolean;
  avatar?: string;
  location?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'poll' | 'announcement' | 'question';
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  isActive: boolean;
  totalVotes: number;
  userVote?: string;
}

export default function VirtualTownHall({
  eventId,
  eventTitle,
  proposalId,
  showNotification,
  onError
}: VirtualTownHallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasHandRaised, setHasHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isVRMode, setIsVRMode] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Mayor Jennifer Adams',
      role: 'moderator',
      isVideoOn: true,
      isAudioOn: true,
      hasHandRaised: false,
      location: 'City Hall'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'participant',
      isVideoOn: true,
      isAudioOn: false,
      hasHandRaised: true,
      location: 'Downtown District'
    },
    {
      id: '3',
      name: 'Mike Chen',
      role: 'participant',
      isVideoOn: false,
      isAudioOn: true,
      hasHandRaised: false,
      location: 'Riverside Area'
    },
    {
      id: 'you',
      name: 'You',
      role: 'participant',
      isVideoOn: false,
      isAudioOn: false,
      hasHandRaised: false
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'Mayor Jennifer Adams',
      message: 'Welcome everyone to today\'s town hall meeting! We\'ll be discussing the community center renovation proposal.',
      timestamp: new Date(Date.now() - 300000),
      type: 'announcement'
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'Sarah Johnson',
      message: 'Thank you for organizing this virtual meeting. Very convenient!',
      timestamp: new Date(Date.now() - 240000),
      type: 'message',
      reactions: [{ emoji: '👍', count: 5, users: ['3', '4', '5', 'you', '6'] }]
    },
    {
      id: '3',
      senderId: '3',
      senderName: 'Mike Chen',
      message: 'I have some questions about the budget allocation. Can we discuss the timeline?',
      timestamp: new Date(Date.now() - 180000),
      type: 'question'
    }
  ]);

  const [activePoll, setActivePoll] = useState<Poll>({
    id: '1',
    question: 'Do you support the proposed community center renovation plan?',
    options: [
      { id: 'yes', text: 'Yes, I support it', votes: 24 },
      { id: 'no', text: 'No, I have concerns', votes: 8 },
      { id: 'neutral', text: 'Need more information', votes: 12 }
    ],
    isActive: true,
    totalVotes: 44
  });

  const [meetingStats, setMeetingStats] = useState({
    totalParticipants: 67,
    handsRaised: 3,
    questionsAsked: 8,
    pollResponses: 44,
    duration: '00:45:23',
    recordingTime: '00:45:23'
  });

  const handleJoinMeeting = async () => {
    try {
      setIsConnected(true);
      showNotification('Successfully joined the virtual town hall!');
      
      // Simulate WebRTC connection
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.log('Media access denied:', error);
        }
      }
    } catch (error) {
      onError('Failed to join the meeting. Please check your connection.');
    }
  };

  const handleLeaveMeeting = () => {
    setIsConnected(false);
    setIsVideoOn(false);
    setIsAudioOn(false);
    setIsScreenSharing(false);
    setHasHandRaised(false);
    showNotification('You have left the meeting');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    showNotification(isVideoOn ? 'Camera turned off' : 'Camera turned on');
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    showNotification(isAudioOn ? 'Microphone muted' : 'Microphone unmuted');
  };

  const toggleHandRaise = () => {
    setHasHandRaised(!hasHandRaised);
    setParticipants(prev => 
      prev.map(p => 
        p.id === 'you' ? { ...p, hasHandRaised: !hasHandRaised } : p
      )
    );
    showNotification(hasHandRaised ? 'Hand lowered' : 'Hand raised - waiting to speak');
  };

  const startScreenShare = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        showNotification('Screen sharing started');
      }
    } catch (error) {
      onError('Failed to start screen sharing');
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'you',
      senderName: 'You',
      message: chatMessage,
      timestamp: new Date(),
      type: 'message'
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const votePoll = (optionId: string) => {
    if (activePoll && !activePoll.userVote) {
      setActivePoll(prev => prev ? {
        ...prev,
        options: prev.options.map(option =>
          option.id === optionId
            ? { ...option, votes: option.votes + 1 }
            : option
        ),
        totalVotes: prev.totalVotes + 1,
        userVote: optionId
      } : prev);
      showNotification('Your vote has been recorded');
    }
  };

  const toggleVRMode = () => {
    setIsVRMode(!isVRMode);
    setIsARMode(false);
    showNotification(isVRMode ? 'VR mode disabled' : 'VR mode enabled - Put on your headset!');
  };

  const toggleARMode = () => {
    setIsARMode(!isARMode);
    setIsVRMode(false);
    showNotification(isARMode ? 'AR mode disabled' : 'AR mode enabled - Use your device camera!');
  };

  const toggle3DView = () => {
    setView3D(!view3D);
    showNotification(view3D ? 'Switched to 2D view' : 'Switched to 3D view');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl mb-2">{eventTitle}</CardTitle>
              <CardDescription className="text-lg">
                Virtual Town Hall Meeting - Interactive Community Discussion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Meeting Info */}
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Today, 7:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>{meetingStats.totalParticipants} participants</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Duration: ~90 minutes</span>
                </div>
              </div>

              {/* Features Available */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Video className="h-5 w-5 mr-2 text-blue-600" />
                      Virtual Participation
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• HD Video & Audio</li>
                      <li>• Screen Sharing</li>
                      <li>• Hand Raising System</li>
                      <li>• Real-time Q&A</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-purple-600" />
                      Advanced Features
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• VR/AR Experience</li>
                      <li>• 3D Meeting Room</li>
                      <li>• Live Polling</li>
                      <li>• Document Sharing</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* VR/AR Options */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-center">Enhanced Experience Options</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => {
                      setIsVRMode(true);
                      handleJoinMeeting();
                    }}
                  >
                    <Headphones className="h-8 w-8 text-purple-600" />
                    <span>Join in VR</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => {
                      setIsARMode(true);
                      handleJoinMeeting();
                    }}
                  >
                    <Globe className="h-8 w-8 text-blue-600" />
                    <span>Join in AR</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2"
                    onClick={handleJoinMeeting}
                  >
                    <Monitor className="h-8 w-8" />
                    <span>Standard Join</span>
                  </Button>
                </div>
              </div>

              {/* System Check */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">System Check</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Camera: Ready
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Microphone: Ready
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Network: Stable
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Browser: Compatible
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isVRMode ? 'bg-gradient-to-br from-purple-900 to-blue-900' : 
                                    isARMode ? 'bg-gradient-to-br from-blue-900 to-teal-900' :
                                    'bg-gray-100'} p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* VR/AR Mode Indicators */}
        {(isVRMode || isARMode) && (
          <div className="mb-4">
            <Badge className={`${isVRMode ? 'bg-purple-600' : 'bg-blue-600'} text-white text-lg px-4 py-2`}>
              {isVRMode ? '🥽 VR Mode Active' : '📱 AR Mode Active'}
            </Badge>
          </div>
        )}

        {/* Main Meeting Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen">
          {/* Video Grid */}
          <div className="lg:col-span-3">
            <Card className={`h-full ${view3D ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{eventTitle}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {meetingStats.totalParticipants} participants
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {meetingStats.duration}
                      </span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        🔴 LIVE
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggle3DView}
                      className={view3D ? 'bg-blue-600 text-white' : ''}
                    >
                      {view3D ? '2D' : '3D'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full pb-20">
                {/* Main Speaker View */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
                  {participants.slice(0, 6).map((participant) => (
                    <div
                      key={participant.id}
                      className={`relative bg-gray-800 rounded-lg overflow-hidden ${
                        participant.role === 'moderator' ? 'ring-2 ring-blue-500' : ''
                      } ${view3D ? 'transform perspective-1000 rotateY-5' : ''}`}
                    >
                      {participant.isVideoOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                          <Users className="h-16 w-16 text-white opacity-50" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-white font-bold text-xl">
                                {participant.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Participant Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">{participant.name}</p>
                            {participant.location && (
                              <p className="text-gray-300 text-xs flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {participant.location}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {participant.hasHandRaised && (
                              <Hand className="h-4 w-4 text-yellow-400" />
                            )}
                            {!participant.isAudioOn && (
                              <MicOff className="h-4 w-4 text-red-400" />
                            )}
                            {participant.role === 'moderator' && (
                              <Badge className="bg-blue-600 text-xs">MOD</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self Video (Picture-in-Picture) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                    You {hasHandRaised && '✋'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Chat & Controls */}
          <div className="space-y-4">
            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={isVideoOn ? "default" : "outline"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isAudioOn ? "default" : "outline"}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={hasHandRaised ? "default" : "outline"}
                    size="sm"
                    onClick={toggleHandRaise}
                    className={hasHandRaised ? "bg-yellow-600" : ""}
                  >
                    <Hand className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startScreenShare}
                  >
                    <ScreenShare className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* VR/AR Controls */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={isVRMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleVRMode}
                    className={isVRMode ? "bg-purple-600" : ""}
                  >
                    <Headphones className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={isARMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleARMode}
                    className={isARMode ? "bg-blue-600" : ""}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveMeeting}
                  className="w-full mt-2"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  Leave Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Live Poll */}
            {activePoll && activePoll.isActive && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Live Poll</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium">{activePoll.question}</p>
                  <div className="space-y-2">
                    {activePoll.options.map((option) => (
                      <Button
                        key={option.id}
                        variant={activePoll.userVote === option.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => votePoll(option.id)}
                        disabled={!!activePoll.userVote}
                        className="w-full justify-between text-left"
                      >
                        <span>{option.text}</span>
                        <span>{option.votes}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total votes: {activePoll.totalVotes}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chat */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Chat & Q&A</span>
                  <Badge variant="secondary">{chatMessages.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 h-64 overflow-y-auto">
                {chatMessages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{message.senderName}</span>
                          {message.type === 'announcement' && (
                            <Badge variant="secondary" className="text-xs">📢</Badge>
                          )}
                          {message.type === 'question' && (
                            <Badge variant="secondary" className="text-xs">❓</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{message.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.reactions && message.reactions.map((reaction, idx) => (
                            <Button key={idx} variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendChatMessage}>
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}