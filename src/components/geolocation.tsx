import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../context/sessionContext'; // path may vary
import { supabase } from '../supabase-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const slemanCenter = { lat: -7.733, lng: 110.355 };

type Story = {
  id: number;
  latitude: number;
  longitude: number;
  content: string;
  email: string;
  created_at: string;
  location_name?: string | null;
  is_public: boolean;
  image_url?: string | null;
};

const GeoLocation = () => {
  const session = useContext(SessionContext); // get session directly (not destructured)
  const [currentLocation, setCurrentLocation] = useState(slemanCenter);
  const [storyText, setStoryText] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string | null>(null);

  const MAPTILER_KEY = 'GB6tFeFIv9m9TNPuiCXF';

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load stories:', error.message);
      return;
    }

    setStories(data as Story[]);
  };

  const handleAddStory = async () => {
    if (!session) {
      setError('You must be logged in to add stories.');
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const { error } = await supabase.from('stories').insert({
          latitude,
          longitude,
          content: storyText || '(No story)',
          email: session.user.email,
          is_public: true,
          // location_name and image_url can be added here if needed
        });

        if (error) {
          setError('Failed to save story: ' + error.message);
          console.error(error);
          return;
        }

        setStoryText('');
        setCurrentLocation({ lat: latitude, lng: longitude });
        setError(null);
        fetchStories();
      },
      (err) => {
        setError('Failed to get location: ' + err.message);
        console.error(err);
      }
    );
  };

  useEffect(() => {
    fetchStories();

    const channel = supabase
      .channel('realtime-stories')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'stories' },
        (payload) => {
          const newStory = payload.new as Story;
          setStories((prev) => [newStory, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <textarea
        placeholder="Write your story here..."
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
        style={{ width: '100%', height: '80px', marginBottom: '0.5rem' }}
      />
      <br />
      <button onClick={handleAddStory}>📝 Add Story</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ height: '500px', marginTop: '1rem' }}>
        <MapContainer
          center={currentLocation}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>'
          />

          {stories.map((story) => (
            <Marker
              key={story.id}
              position={{ lat: story.latitude, lng: story.longitude }}
            >
              <Popup>
                <strong>{story.email}</strong>
                <br />
                {story.content}
                {story.location_name && (
                  <>
                    <br />
                    <em>{story.location_name}</em>
                  </>
                )}
                {story.image_url && (
                  <>
                    <br />
                    <img
                      src={story.image_url}
                      alt="Story image"
                      style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '0.5rem' }}
                    />
                  </>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default GeoLocation;
