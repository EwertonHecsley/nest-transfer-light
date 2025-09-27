/**
 * Representa um tipo que pode ser um de dois tipos.
 * Left (falha) ou Right (sucesso).
 */
export type Either<L, A> = Left<L, A> | Right<L, A>;

/**
 * A classe Left representa o lado da "falha" da operação.
 */
export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

/**
 * A classe Right representa o lado de "sucesso" da operação.
 */
export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }
}

/**
 * Funções auxiliares para criar instâncias de Left ou Right.
 */
export const left = <L, A>(l: L): Either<L, A> => {
  return new Left<L, A>(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
