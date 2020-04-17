import database from '../../src/Database';

export default function truncate() {
  return Promise.all(
    Object.keys(database.connection.models).map(key => {
      return database.connection.models[key].destroy({
        where: {},
        truncate: true,
        force: true,
        cascade: true,
      });
    })
  );
}
