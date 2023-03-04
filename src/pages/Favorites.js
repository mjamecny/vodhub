import { FaRegTrashAlt, FaRegClock, FaRegCalendarAlt } from "react-icons/fa"
import Button from "../components/Button"

const Favorites = (props) => {
  return (
    <section className="section-vods">
      {props.state.favs.length !== 0 ? (
        <div>
          <Button dispatch={props.dispatch} />
          <div className="vods">
            {props.state.favs.map((fav) => {
              const { id, thumbnail_url, url, title, published_at, duration } =
                fav

              const final_src = thumbnail_url.replace(
                /%{width}x%{height}/g,
                "1280x720"
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
                      <button
                        onClick={() =>
                          props.dispatch({
                            type: "REMOVE_FAV",
                            payload: id,
                          })
                        }
                        className="del-btn"
                        data-id={id}
                      >
                        <FaRegTrashAlt className="icon-fav" />
                      </button>

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
        </div>
      ) : (
        <div className="novods">
          Don't have any favorite videos saved yet? No problem! Just browse
          selection of videos from any Twitch streamer and click the "checkmark"
          button on any video you want to save for later.
        </div>
      )}

      <div className="spinner"></div>
    </section>
  )
}

export default Favorites
