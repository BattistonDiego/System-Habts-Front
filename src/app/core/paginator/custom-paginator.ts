import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Itens por página';

  paginatorIntl.getRangeLabel = (page, pageSize, length) => {
    if (length === 0) {
      return 'Nenhum registro';
    }

    const totalPages = Math.ceil(length / pageSize);

    return `Mostrando página ${page + 1} de ${totalPages}`;
  };

  return paginatorIntl;
}
