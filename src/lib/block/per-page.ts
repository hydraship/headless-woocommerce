import _ from 'lodash';

export const findPerPage = (data: unknown): number | null => {
  if (!Array.isArray(data)) return null;

  for (const obj of data) {
    // Check if perPage exists at the current level
    const perPage = _.get(obj, 'attrs.query.perPage', null);
    if (perPage !== null) return perPage;

    // Recursively search in innerBlocks if they exist
    if (_.has(obj, 'innerBlocks')) {
      const nestedPerPage = findPerPage(obj.innerBlocks);
      if (nestedPerPage !== null) return nestedPerPage;
    }
  }

  return null;
};
