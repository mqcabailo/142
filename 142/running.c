#include <stdio.h>

#define N 8

int a[N][N];
int check(int,int);
main(){
  int row,col,prev,flag,count=0,i,j;

  //array init
  for(i=0; i<N; i+=1)
    for(j=0; j<N; j+=1)
      a[i][j] = 0;

  for(row=0;row<N;row++){
    flag=0;
    for(prev=0;prev<N;prev++){
      if(a[row][prev]==1){
        a[row][prev]=0;
        flag=1;
        break;
      }
    }

    // no chancellor in curr row
    if(flag==0){
      prev=-1;
    }

    flag=0;
    //put chancellor on board
    for(col=prev+1;col<N;col++){
      if(check(r ow,col)){
        a[row][col]=1;
        flag=1;
        break;
      }
    }

    //end
    if(row==0&&flag==0)
      break;
    //solutions are exhausted
    else if(col==N)
      row=row-2;
    //solution found
    else if(row==N-1&&flag==1){
      // show solution
      printf("solution found!\n");
      for(i=0; i<N; i+=1){
        for(j=0; j<N; j+=1){
          printf("%d ", a[i][j]);
        }
        printf("\n");
      }
      printf("\n");
      count++;
      row=row-1;                             
    }
    // printf("Dulo\n");
    //       for(i=0; i<N; i+=1){
    //     for(j=0; j<N; j+=1){
    //       printf("%d ", a[i][j]);
    //     }
    //     printf("\n");
    //   }
  }
  printf("solutions: %d\n", count);
}

int check(int row,int col){
  int i;
  for(i=0;i<row;i++){
    if((a[row-1-i][col]==1)  ||  (a[row-1][col-2]==1&&(row-1>=0)&&(col-2>=0) )  || (a[row-2][col-1]==1&&(row-2>=0)&&(col-1>=0) ) || (a[row-2][col+1]==1&&(row-2>=0)&&(col+1<=N-1) ) || (a[row-1][col+2]==1&&(row-1>=0)&&(col+2<=N-1)))
      return 0;
  }
  return 1;
}

