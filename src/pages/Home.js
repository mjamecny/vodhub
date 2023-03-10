import { FaCheck, FaRegClock, FaRegCalendarAlt } from 'react-icons/fa'

const Home = (props) => {
  return (
    <section className="section-vods">
      {!props.state.loaded ? (
        <div className="initial">
          <h1>Welcome to VODhub</h1>
          <p>Search and add to Favorites Twitch VODs</p>
        </div>
      ) : (
        <div className="vods">
          {props.state.vods.map((vod) => {
            const { id, thumbnail_url, url, title, published_at, duration } =
              vod

            const final_src = thumbnail_url.replace(
              /%{width}x%{height}/g,
              '1280x720'
            )

            const date = new Date(published_at)

            const [month, day, year] = [
              date.getMonth(),
              date.getDate(),
              date.getFullYear(),
            ]

            return (
              <div className="one-vod" key={id}>
                <img className="image" src={final_src} alt="thumbnail" />
                <div className="box">
                  <h2 className="title">
                    <a className="link" href={url}>
                      {title}
                    </a>
                  </h2>
                  <div className="text-box">
                    <p className="date">
                      <FaRegCalendarAlt className="icon" />
                      <span>{`${day}/${month + 1}/${year}`}</span>
                    </p>
                    <FaCheck
                      className="icon-fav"
                      data-id={id}
                      onClick={(e) =>
                        props.dispatch({
                          type: 'ADD_FAV',
                          payload: e.currentTarget.dataset.id,
                        })
                      }
                    />
                    <p className="duration">
                      <FaRegClock className="icon" />
                      <span>{duration}</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="spinner"></div>
    </section>
  )
}

export default Home
